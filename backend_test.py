#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime
import time
import uuid

class LondwayFondBankTester:
    def __init__(self, base_url="https://question-site.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.user_token = None
        self.admin_token = None
        self.user_data = None
        self.admin_data = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, token=None, params=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        if token:
            headers['Authorization'] = f'Bearer {token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return True, response.json()
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"Response: {response.text}")
                self.failed_tests.append(f"{name}: Expected {expected_status}, got {response.status_code}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append(f"{name}: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test API health endpoint"""
        success, response = self.run_test(
            "API Health Check",
            "GET",
            "health",
            200
        )
        return success

    def test_root_endpoint(self):
        """Test root API endpoint"""
        success, response = self.run_test(
            "API Root",
            "GET",
            "",
            200
        )
        return success

    def test_user_registration(self):
        """Test user registration"""
        timestamp = str(int(time.time()))
        test_user = {
            "email": f"testuser_{timestamp}@example.com",
            "password": "TestPass123!",
            "first_name": "Test",
            "last_name": "User",
            "phone": "+1234567890"
        }
        
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data=test_user
        )
        
        if success and 'access_token' in response:
            self.user_token = response['access_token']
            self.user_data = response['user']
            print(f"✅ User registered with account: {self.user_data['account_number']}")
            return True
        return False

    def test_admin_login(self):
        """Test admin login"""
        admin_credentials = {
            "email": "admin@londwayfond.com",
            "password": "Admin@123"
        }
        
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "auth/login",
            200,
            data=admin_credentials
        )
        
        if success and 'access_token' in response:
            self.admin_token = response['access_token']
            self.admin_data = response['user']
            print(f"✅ Admin logged in: {self.admin_data['email']}")
            return True
        return False

    def test_user_login(self):
        """Test user login"""
        if not self.user_data:
            return False
        
        login_data = {
            "email": self.user_data['email'],
            "password": "TestPass123!"
        }
        
        success, response = self.run_test(
            "User Login",
            "POST", 
            "auth/login",
            200,
            data=login_data
        )
        return success

    def test_get_user_profile(self):
        """Test getting current user profile"""
        success, response = self.run_test(
            "Get User Profile",
            "GET",
            "auth/me",
            200,
            token=self.user_token
        )
        return success

    def test_get_balance(self):
        """Test getting account balance"""
        success, response = self.run_test(
            "Get Account Balance",
            "GET",
            "account/balance",
            200,
            token=self.user_token
        )
        
        if success:
            print(f"✅ Balance: ${response.get('balance', 0)}")
        return success

    def test_update_profile(self):
        """Test profile update"""
        profile_updates = {
            "first_name": "Updated",
            "last_name": "Name",
            "phone": "+9876543210"
        }
        
        success, response = self.run_test(
            "Update Profile",
            "PUT",
            "account/profile",
            200,
            data=profile_updates,
            token=self.user_token
        )
        return success

    def test_account_lookup(self):
        """Test account lookup for transfers"""
        if not self.admin_data:
            return False
            
        success, response = self.run_test(
            "Account Lookup",
            "GET",
            f"transfers/lookup/{self.admin_data['account_number']}",
            200,
            token=self.user_token
        )
        
        if success:
            print(f"✅ Found account: {response.get('name')}")
        return success

    def test_send_money(self):
        """Test money transfer"""
        if not self.admin_data or not self.user_data:
            return False
        
        # Get current balance first
        _, balance_resp = self.run_test(
            "Pre-transfer Balance Check", 
            "GET", 
            "account/balance", 
            200, 
            token=self.user_token
        )
        
        if balance_resp.get('balance', 0) < 50:
            print("⚠️  Insufficient balance for transfer test")
            return False
        
        transfer_data = {
            "recipient_account": self.admin_data['account_number'],
            "amount": 25.00,
            "description": "Test transfer"
        }
        
        success, response = self.run_test(
            "Send Money Transfer",
            "POST",
            "transfers/send",
            200,
            data=transfer_data,
            token=self.user_token
        )
        
        if success:
            print(f"✅ Transfer ID: {response.get('transaction_id')}")
        return success

    def test_create_deposit(self):
        """Test creating a deposit (Stripe checkout)"""
        deposit_data = {
            "amount": 100.00,
            "origin_url": "https://question-site.preview.emergentagent.com"
        }
        
        success, response = self.run_test(
            "Create Deposit (Stripe)",
            "POST",
            "deposits/create",
            200,
            data=deposit_data,
            token=self.user_token
        )
        
        if success and 'checkout_url' in response:
            print(f"✅ Stripe checkout URL created: {response['checkout_url'][:50]}...")
        return success

    def test_get_transactions(self):
        """Test getting transaction history"""
        success, response = self.run_test(
            "Get Transaction History",
            "GET",
            "transactions",
            200,
            token=self.user_token,
            params={"limit": 10}
        )
        
        if success:
            transactions = response if isinstance(response, list) else []
            print(f"✅ Found {len(transactions)} transactions")
        return success

    def test_create_card(self):
        """Test creating a virtual card"""
        card_data = {
            "card_type": "virtual",
            "card_name": "Test Card"
        }
        
        success, response = self.run_test(
            "Create Virtual Card",
            "POST",
            "cards",
            200,
            data=card_data,
            token=self.user_token
        )
        
        if success and 'id' in response:
            self.test_card_id = response['id']
            print(f"✅ Card created: {response['card_number']}")
        return success

    def test_get_cards(self):
        """Test getting user cards"""
        success, response = self.run_test(
            "Get User Cards",
            "GET",
            "cards",
            200,
            token=self.user_token
        )
        
        if success:
            cards = response if isinstance(response, list) else []
            print(f"✅ Found {len(cards)} cards")
        return success

    def test_freeze_card(self):
        """Test freezing a card"""
        if not hasattr(self, 'test_card_id'):
            return False
            
        success, response = self.run_test(
            "Freeze Card",
            "PUT",
            f"cards/{self.test_card_id}/freeze",
            200,
            token=self.user_token
        )
        return success

    def test_activate_card(self):
        """Test activating a card"""
        if not hasattr(self, 'test_card_id'):
            return False
            
        success, response = self.run_test(
            "Activate Card",
            "PUT",
            f"cards/{self.test_card_id}/activate",
            200,
            token=self.user_token
        )
        return success

    def test_admin_get_users(self):
        """Test admin getting all users"""
        success, response = self.run_test(
            "Admin Get Users",
            "GET",
            "admin/users",
            200,
            token=self.admin_token,
            params={"limit": 10}
        )
        
        if success:
            users = response.get('users', [])
            print(f"✅ Found {len(users)} users (Total: {response.get('total', 0)})")
        return success

    def test_admin_search_users(self):
        """Test admin searching users"""
        success, response = self.run_test(
            "Admin Search Users",
            "GET",
            "admin/users",
            200,
            token=self.admin_token,
            params={"search": "admin", "limit": 5}
        )
        
        if success:
            users = response.get('users', [])
            print(f"✅ Search found {len(users)} users")
        return success

    def test_admin_get_transactions(self):
        """Test admin getting all transactions"""
        success, response = self.run_test(
            "Admin Get All Transactions",
            "GET",
            "admin/transactions",
            200,
            token=self.admin_token,
            params={"limit": 10}
        )
        
        if success:
            transactions = response.get('transactions', [])
            print(f"✅ Found {len(transactions)} transactions (Total: {response.get('total', 0)})")
        return success

    def test_admin_stats(self):
        """Test admin getting system statistics"""
        success, response = self.run_test(
            "Admin System Stats",
            "GET",
            "admin/stats",
            200,
            token=self.admin_token
        )
        
        if success:
            stats = response
            print(f"✅ Stats - Users: {stats.get('total_users')}, Transactions: {stats.get('total_transactions')}, Volume: ${stats.get('total_volume', 0)}")
        return success

    def test_admin_update_user(self):
        """Test admin updating user"""
        if not self.user_data:
            return False
            
        update_data = {
            "balance": 2000.00
        }
        
        success, response = self.run_test(
            "Admin Update User",
            "PUT",
            f"admin/users/{self.user_data['id']}",
            200,
            data=update_data,
            token=self.admin_token
        )
        return success

def main():
    print("🏦 LONDWAYFOND Bank API Testing Suite")
    print("=" * 50)
    
    # Initialize tester
    tester = LondwayFondBankTester()
    
    # Test sequence
    tests = [
        # Basic API Tests
        ("Health Check", tester.test_health_check),
        ("Root Endpoint", tester.test_root_endpoint),
        
        # Authentication Tests
        ("User Registration", tester.test_user_registration),
        ("Admin Login", tester.test_admin_login),
        ("User Login", tester.test_user_login),
        ("Get User Profile", tester.test_get_user_profile),
        
        # Account Tests
        ("Get Balance", tester.test_get_balance),
        ("Update Profile", tester.test_update_profile),
        
        # Transfer Tests
        ("Account Lookup", tester.test_account_lookup),
        ("Send Money", tester.test_send_money),
        
        # Deposit Tests
        ("Create Deposit", tester.test_create_deposit),
        
        # Transaction Tests
        ("Get Transactions", tester.test_get_transactions),
        
        # Card Tests
        ("Create Card", tester.test_create_card),
        ("Get Cards", tester.test_get_cards),
        ("Freeze Card", tester.test_freeze_card),
        ("Activate Card", tester.test_activate_card),
        
        # Admin Tests
        ("Admin Get Users", tester.test_admin_get_users),
        ("Admin Search Users", tester.test_admin_search_users),
        ("Admin Get Transactions", tester.test_admin_get_transactions),
        ("Admin Stats", tester.test_admin_stats),
        ("Admin Update User", tester.test_admin_update_user),
    ]
    
    # Run all tests
    for test_name, test_func in tests:
        try:
            test_func()
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {str(e)}")
            tester.failed_tests.append(f"{test_name}: Exception - {str(e)}")
        
        # Small delay between tests
        time.sleep(0.2)
    
    # Print results
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    success_rate = (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0
    print(f"📈 Success Rate: {success_rate:.1f}%")
    
    if tester.failed_tests:
        print("\n❌ Failed Tests:")
        for failure in tester.failed_tests:
            print(f"  • {failure}")
    
    # Return exit code
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())