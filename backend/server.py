from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
# from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionResponse, CheckoutStatusResponse, CheckoutSessionRequest

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'londwayfond-bank-secret-key-2026')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# Stripe Configuration
STRIPE_API_KEY = os.environ.get('STRIPE_API_KEY', 'sk_test_emergent')

# Create the main app
app = FastAPI(title="LONDWAYFOND Bank API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()

# ==================== MODELS ====================

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    first_name: str
    last_name: str
    phone: Optional[str] = None
    account_number: str
    balance: float
    currency: str
    is_admin: bool
    is_active: bool
    created_at: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class TransferRequest(BaseModel):
    recipient_account: str
    amount: float
    description: Optional[str] = None

class DepositRequest(BaseModel):
    amount: float
    origin_url: str

class TransactionResponse(BaseModel):
    id: str
    type: str
    amount: float
    currency: str
    description: Optional[str] = None
    sender_account: Optional[str] = None
    recipient_account: Optional[str] = None
    status: str
    created_at: str

class CardCreate(BaseModel):
    card_type: str = "virtual"
    card_name: Optional[str] = None

class CardResponse(BaseModel):
    id: str
    card_number: str
    card_holder: str
    expiry_date: str
    cvv: str
    card_type: str
    status: str
    spending_limit: float
    created_at: str

class AdminUserUpdate(BaseModel):
    is_active: Optional[bool] = None
    is_admin: Optional[bool] = None
    balance: Optional[float] = None

class ProfileUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None

# ==================== HELPERS ====================

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str, is_admin: bool = False) -> str:
    payload = {
        "sub": user_id,
        "is_admin": is_admin,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def generate_account_number() -> str:
    """Generate a 12-digit account number (pure numbers)"""
    import random
    return "".join([str(random.randint(0, 9)) for _ in range(12)])

def generate_card_number() -> str:
    return "4" + "".join([str(uuid.uuid4().int % 10) for _ in range(15)])

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        
        if not user.get("is_active", True):
            raise HTTPException(status_code=403, detail="Account is deactivated")
        
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_admin_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    user = await get_current_user(credentials)
    if not user.get("is_admin", False):
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

def user_to_response(user: dict) -> UserResponse:
    return UserResponse(
        id=user["id"],
        email=user["email"],
        first_name=user["first_name"],
        last_name=user["last_name"],
        phone=user.get("phone"),
        account_number=user["account_number"],
        balance=user["balance"],
        currency=user["currency"],
        is_admin=user.get("is_admin", False),
        is_active=user.get("is_active", True),
        created_at=user["created_at"]
    )

# ==================== AUTH ROUTES ====================

@api_router.post("/auth/register", response_model=TokenResponse)
async def register(user_data: UserCreate):
    # Check if email exists
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    account_number = generate_account_number()
    
    user = {
        "id": user_id,
        "email": user_data.email,
        "password_hash": hash_password(user_data.password),
        "first_name": user_data.first_name,
        "last_name": user_data.last_name,
        "phone": user_data.phone,
        "account_number": account_number,
        "balance": 1000.00,  # Welcome bonus
        "currency": "USD",
        "is_admin": False,
        "is_active": True,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.users.insert_one(user)
    
    # Create welcome transaction
    welcome_tx = {
        "id": str(uuid.uuid4()),
        "user_id": user_id,
        "type": "deposit",
        "amount": 1000.00,
        "currency": "USD",
        "description": "Welcome bonus",
        "sender_account": "SYSTEM",
        "recipient_account": account_number,
        "status": "completed",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.transactions.insert_one(welcome_tx)
    
    token = create_token(user_id)
    user_response = user_to_response(user)
    
    return TokenResponse(access_token=token, user=user_response)

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not user.get("is_active", True):
        raise HTTPException(status_code=403, detail="Account is deactivated")
    
    token = create_token(user["id"], user.get("is_admin", False))
    user_response = user_to_response(user)
    
    return TokenResponse(access_token=token, user=user_response)

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(user: dict = Depends(get_current_user)):
    return user_to_response(user)

# ==================== ACCOUNT ROUTES ====================

@api_router.get("/account/balance")
async def get_balance(user: dict = Depends(get_current_user)):
    return {
        "balance": user["balance"],
        "currency": user["currency"],
        "account_number": user["account_number"]
    }

@api_router.put("/account/profile", response_model=UserResponse)
async def update_profile(profile: ProfileUpdate, user: dict = Depends(get_current_user)):
    updates = {}
    if profile.first_name:
        updates["first_name"] = profile.first_name
    if profile.last_name:
        updates["last_name"] = profile.last_name
    if profile.phone:
        updates["phone"] = profile.phone
    
    if updates:
        await db.users.update_one({"id": user["id"]}, {"$set": updates})
        user.update(updates)
    
    return user_to_response(user)

# ==================== TRANSFER ROUTES ====================

@api_router.post("/transfers/send")
async def send_money(transfer: TransferRequest, user: dict = Depends(get_current_user)):
    if transfer.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")
    
    if transfer.amount > user["balance"]:
        raise HTTPException(status_code=400, detail="Insufficient balance")
    
    if transfer.recipient_account == user["account_number"]:
        raise HTTPException(status_code=400, detail="Cannot transfer to yourself")
    
    # Find recipient
    recipient = await db.users.find_one({"account_number": transfer.recipient_account}, {"_id": 0})
    if not recipient:
        raise HTTPException(status_code=404, detail="Recipient account not found")
    
    if not recipient.get("is_active", True):
        raise HTTPException(status_code=400, detail="Recipient account is inactive")
    
    # Perform transfer
    tx_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    # Deduct from sender
    await db.users.update_one(
        {"id": user["id"]},
        {"$inc": {"balance": -transfer.amount}}
    )
    
    # Add to recipient
    await db.users.update_one(
        {"id": recipient["id"]},
        {"$inc": {"balance": transfer.amount}}
    )
    
    # Create transactions for both parties
    sender_tx = {
        "id": tx_id,
        "user_id": user["id"],
        "type": "transfer_out",
        "amount": transfer.amount,
        "currency": user["currency"],
        "description": transfer.description or f"Transfer to {recipient['first_name']} {recipient['last_name']}",
        "sender_account": user["account_number"],
        "recipient_account": transfer.recipient_account,
        "status": "completed",
        "created_at": now
    }
    
    recipient_tx = {
        "id": str(uuid.uuid4()),
        "user_id": recipient["id"],
        "type": "transfer_in",
        "amount": transfer.amount,
        "currency": recipient["currency"],
        "description": transfer.description or f"Transfer from {user['first_name']} {user['last_name']}",
        "sender_account": user["account_number"],
        "recipient_account": transfer.recipient_account,
        "status": "completed",
        "created_at": now
    }
    
    await db.transactions.insert_many([sender_tx, recipient_tx])
    
    return {
        "message": "Transfer successful",
        "transaction_id": tx_id,
        "amount": transfer.amount,
        "recipient": f"{recipient['first_name']} {recipient['last_name']}"
    }

@api_router.get("/transfers/lookup/{account_number}")
async def lookup_account(account_number: str, user: dict = Depends(get_current_user)):
    recipient = await db.users.find_one({"account_number": account_number}, {"_id": 0})
    if not recipient:
        raise HTTPException(status_code=404, detail="Account not found")
    
    return {
        "account_number": recipient["account_number"],
        "name": f"{recipient['first_name']} {recipient['last_name']}"
    }

# ==================== DEPOSIT/STRIPE ROUTES ====================

@api_router.post("/deposits/create")
async def create_deposit(deposit: DepositRequest, request: Request, user: dict = Depends(get_current_user)):
    if deposit.amount < 10.00:
        raise HTTPException(status_code=400, detail="Minimum deposit is $10.00")
    
    host_url = str(request.base_url).rstrip('/')
    webhook_url = f"{host_url}/api/webhook/stripe"
    
    # stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    
    success_url = f"{deposit.origin_url}/dashboard?payment=success&session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{deposit.origin_url}/dashboard?payment=cancelled"
    
    # checkout_request = CheckoutSessionRequest(
    #     amount=float(deposit.amount),
    #     currency="usd",
    #     success_url=success_url,
    #     cancel_url=cancel_url,
    #     metadata={
    #         "user_id": user["id"],
    #         "account_number": user["account_number"],
    #         "type": "deposit"
    #     }
    # )
    
    session = await stripe_checkout.create_checkout_session(checkout_request)
    
    # Create pending payment transaction
    payment_tx = {
        "id": str(uuid.uuid4()),
        "session_id": session.session_id,
        "user_id": user["id"],
        "amount": deposit.amount,
        "currency": "USD",
        "status": "pending",
        "payment_status": "initiated",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.payment_transactions.insert_one(payment_tx)
    
    return {
        "checkout_url": session.url,
        "session_id": session.session_id
    }

@api_router.get("/deposits/status/{session_id}")
async def get_deposit_status(session_id: str, request: Request, user: dict = Depends(get_current_user)):
    host_url = str(request.base_url).rstrip('/')
    webhook_url = f"{host_url}/api/webhook/stripe"
    
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    
    try:
        status = await stripe_checkout.get_checkout_status(session_id)
        
        # Find and update payment transaction
        payment_tx = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
        
        if payment_tx and payment_tx["payment_status"] != "completed":
            if status.payment_status == "paid":
                # Update payment transaction
                await db.payment_transactions.update_one(
                    {"session_id": session_id},
                    {"$set": {"status": "completed", "payment_status": "completed"}}
                )
                
                # Credit user's account (convert cents to dollars)
                amount = status.amount_total / 100
                await db.users.update_one(
                    {"id": user["id"]},
                    {"$inc": {"balance": amount}}
                )
                
                # Create deposit transaction
                deposit_tx = {
                    "id": str(uuid.uuid4()),
                    "user_id": user["id"],
                    "type": "deposit",
                    "amount": amount,
                    "currency": "USD",
                    "description": "Card deposit via Stripe",
                    "sender_account": "STRIPE",
                    "recipient_account": user["account_number"],
                    "status": "completed",
                    "created_at": datetime.now(timezone.utc).isoformat()
                }
                await db.transactions.insert_one(deposit_tx)
        
        return {
            "status": status.status,
            "payment_status": status.payment_status,
            "amount": status.amount_total / 100
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    body = await request.body()
    signature = request.headers.get("Stripe-Signature")
    
    host_url = str(request.base_url).rstrip('/')
    webhook_url = f"{host_url}/api/webhook/stripe"
    
    # stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    
    try:
        webhook_response = await stripe_checkout.handle_webhook(body, signature)
        
        if webhook_response.payment_status == "paid":
            session_id = webhook_response.session_id
            metadata = webhook_response.metadata
            
            # Check if already processed
            payment_tx = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
            if payment_tx and payment_tx["payment_status"] != "completed":
                user_id = metadata.get("user_id")
                
                # Update payment transaction
                await db.payment_transactions.update_one(
                    {"session_id": session_id},
                    {"$set": {"status": "completed", "payment_status": "completed"}}
                )
                
                # Credit will be done when user checks status
        
        return {"status": "received"}
    except Exception as e:
        logging.error(f"Webhook error: {e}")
        return {"status": "error", "message": str(e)}

# ==================== TRANSACTION ROUTES ====================

@api_router.get("/transactions", response_model=List[TransactionResponse])
async def get_transactions(
    limit: int = 50,
    offset: int = 0,
    user: dict = Depends(get_current_user)
):
    transactions = await db.transactions.find(
        {"user_id": user["id"]},
        {"_id": 0}
    ).sort("created_at", -1).skip(offset).limit(limit).to_list(limit)
    
    return transactions

@api_router.get("/transactions/{tx_id}", response_model=TransactionResponse)
async def get_transaction(tx_id: str, user: dict = Depends(get_current_user)):
    tx = await db.transactions.find_one(
        {"id": tx_id, "user_id": user["id"]},
        {"_id": 0}
    )
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return tx

# ==================== CARDS ROUTES ====================

@api_router.post("/cards", response_model=CardResponse)
async def create_card(card_data: CardCreate, user: dict = Depends(get_current_user)):
    # Check card limit (max 3 cards per user)
    card_count = await db.cards.count_documents({"user_id": user["id"], "status": "active"})
    if card_count >= 3:
        raise HTTPException(status_code=400, detail="Maximum 3 active cards allowed")
    
    card_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc)
    expiry = now + timedelta(days=365*3)  # 3 years validity
    
    card = {
        "id": card_id,
        "user_id": user["id"],
        "card_number": generate_card_number(),
        "card_holder": f"{user['first_name']} {user['last_name']}".upper(),
        "expiry_date": expiry.strftime("%m/%y"),
        "cvv": str(uuid.uuid4().int % 1000).zfill(3),
        "card_type": card_data.card_type,
        "card_name": card_data.card_name or "Primary Card",
        "status": "active",
        "spending_limit": 5000.00,
        "created_at": now.isoformat()
    }
    
    await db.cards.insert_one(card)
    
    return CardResponse(**{k: v for k, v in card.items() if k != "user_id"})

@api_router.get("/cards", response_model=List[CardResponse])
async def get_cards(user: dict = Depends(get_current_user)):
    cards = await db.cards.find(
        {"user_id": user["id"]},
        {"_id": 0, "user_id": 0}
    ).to_list(10)
    return cards

@api_router.put("/cards/{card_id}/freeze")
async def freeze_card(card_id: str, user: dict = Depends(get_current_user)):
    result = await db.cards.update_one(
        {"id": card_id, "user_id": user["id"]},
        {"$set": {"status": "frozen"}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Card not found")
    return {"message": "Card frozen successfully"}

@api_router.put("/cards/{card_id}/activate")
async def activate_card(card_id: str, user: dict = Depends(get_current_user)):
    result = await db.cards.update_one(
        {"id": card_id, "user_id": user["id"]},
        {"$set": {"status": "active"}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Card not found")
    return {"message": "Card activated successfully"}

@api_router.delete("/cards/{card_id}")
async def delete_card(card_id: str, user: dict = Depends(get_current_user)):
    result = await db.cards.delete_one({"id": card_id, "user_id": user["id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Card not found")
    return {"message": "Card deleted successfully"}

# ==================== ADMIN ROUTES ====================

@api_router.get("/admin/users")
async def admin_get_users(
    limit: int = 50,
    offset: int = 0,
    search: Optional[str] = None,
    admin: dict = Depends(get_admin_user)
):
    query = {}
    if search:
        query["$or"] = [
            {"email": {"$regex": search, "$options": "i"}},
            {"first_name": {"$regex": search, "$options": "i"}},
            {"last_name": {"$regex": search, "$options": "i"}},
            {"account_number": {"$regex": search, "$options": "i"}}
        ]
    
    users = await db.users.find(query, {"_id": 0, "password_hash": 0}).skip(offset).limit(limit).to_list(limit)
    total = await db.users.count_documents(query)
    
    return {"users": users, "total": total}

@api_router.get("/admin/users/{user_id}")
async def admin_get_user(user_id: str, admin: dict = Depends(get_admin_user)):
    user = await db.users.find_one({"id": user_id}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@api_router.put("/admin/users/{user_id}")
async def admin_update_user(user_id: str, updates: AdminUserUpdate, admin: dict = Depends(get_admin_user)):
    update_dict = {}
    if updates.is_active is not None:
        update_dict["is_active"] = updates.is_active
    if updates.is_admin is not None:
        update_dict["is_admin"] = updates.is_admin
    if updates.balance is not None:
        update_dict["balance"] = updates.balance
    
    if not update_dict:
        raise HTTPException(status_code=400, detail="No updates provided")
    
    result = await db.users.update_one({"id": user_id}, {"$set": update_dict})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": "User updated successfully"}

@api_router.get("/admin/transactions")
async def admin_get_transactions(
    limit: int = 50,
    offset: int = 0,
    user_id: Optional[str] = None,
    admin: dict = Depends(get_admin_user)
):
    query = {}
    if user_id:
        query["user_id"] = user_id
    
    transactions = await db.transactions.find(query, {"_id": 0}).sort("created_at", -1).skip(offset).limit(limit).to_list(limit)
    total = await db.transactions.count_documents(query)
    
    return {"transactions": transactions, "total": total}

@api_router.get("/admin/stats")
async def admin_get_stats(admin: dict = Depends(get_admin_user)):
    total_users = await db.users.count_documents({})
    active_users = await db.users.count_documents({"is_active": True})
    total_transactions = await db.transactions.count_documents({})
    
    # Calculate total volume
    pipeline = [
        {"$match": {"status": "completed"}},
        {"$group": {"_id": None, "total": {"$sum": "$amount"}}}
    ]
    volume_result = await db.transactions.aggregate(pipeline).to_list(1)
    total_volume = volume_result[0]["total"] if volume_result else 0
    
    # Calculate total balance across all accounts
    balance_pipeline = [
        {"$group": {"_id": None, "total": {"$sum": "$balance"}}}
    ]
    balance_result = await db.users.aggregate(balance_pipeline).to_list(1)
    total_balance = balance_result[0]["total"] if balance_result else 0
    
    return {
        "total_users": total_users,
        "active_users": active_users,
        "total_transactions": total_transactions,
        "total_volume": total_volume,
        "total_balance": total_balance
    }

# ==================== UTILITY ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "LONDWAYFOND Bank API", "version": "1.0.0"}

@api_router.get("/health")
async def health():
    return {"status": "healthy"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup():
    # Create indexes
    await db.users.create_index("email", unique=True)
    await db.users.create_index("account_number", unique=True)
    await db.transactions.create_index("user_id")
    await db.transactions.create_index("created_at")
    await db.cards.create_index("user_id")
    await db.payment_transactions.create_index("session_id")
    
    # Create default admin if not exists
    admin = await db.users.find_one({"email": "admin@londwayfond.com"})
    if not admin:
        admin_user = {
            "id": str(uuid.uuid4()),
            "email": "admin@londwayfond.com",
            "password_hash": hash_password("Admin@123"),
            "first_name": "System",
            "last_name": "Administrator",
            "phone": "+1234567890",
            "account_number": generate_account_number(),
            "balance": 100000.00,
            "currency": "USD",
            "is_admin": True,
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(admin_user)
        logger.info("Default admin created: admin@londwayfond.com / Admin@123")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
