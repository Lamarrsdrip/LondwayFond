# LONDWAYFOND Bank - Product Requirements Document

## Project Overview
**Bank Name:** LONDWAYFOND Bank  
**Type:** Modern Online Banking Website  
**Tech Stack:** React (Frontend) + FastAPI (Backend) + MongoDB  
**Created:** March 12, 2026

## Architecture

### Backend (FastAPI)
- `/app/backend/server.py` - Main API server
- JWT Authentication with bcrypt password hashing
- MongoDB collections: users, transactions, cards, payment_transactions
- Stripe integration for deposits (test mode + production ready)

### Frontend (React)
- `/app/frontend/src/` - React application
- Premium design with gold (#C9A227) and navy (#0A1628) theme
- Responsive design with mobile navigation
- Protected routes with role-based access

## Core Requirements

### User Features
1. **Authentication**
   - Email/password registration with validation
   - JWT-based session management
   - $1,000 welcome bonus for new accounts

2. **Dashboard**
   - Account balance display
   - Quick actions (Send, Deposit, Cards, History)
   - Recent transactions list

3. **Send Money**
   - 3-step transfer process
   - Account lookup by account number
   - Real-time balance validation

4. **Receive/Deposit**
   - Account details for receiving transfers
   - Stripe-powered card deposits
   - Multiple preset amounts + custom input

5. **Transactions**
   - Full transaction history
   - Filter by type (incoming/outgoing)
   - Search functionality

6. **Virtual Cards**
   - Create up to 3 virtual cards
   - Freeze/activate cards
   - Delete cards

7. **Profile**
   - View account details
   - Update name and phone

### Admin Features
1. **Admin Dashboard**
   - System statistics (users, transactions, volume)
   - Quick action links

2. **User Management**
   - Search and filter users
   - Edit user balance, status, admin privileges
   - Pagination

3. **Transaction Monitoring**
   - View all system transactions
   - Filter by user ID

## What's Been Implemented ✅
- [x] Landing page with premium design
- [x] User registration and login
- [x] User dashboard with balance and transactions
- [x] Send money (internal transfers)
- [x] Receive/Deposit with Stripe integration
- [x] Transaction history
- [x] Virtual cards management
- [x] Profile settings
- [x] Admin dashboard with statistics
- [x] Admin user management
- [x] Admin transaction monitoring
- [x] Contact page with London/NY offices
- [x] Mobile-responsive design

## Contact Information
**London Office:** 8 Canada Square, London, E14 5HQ, United Kingdom  
**New York HQ:** 388 Greenwich Street, New York, NY 10013, United States

## Credentials
**Admin Account:** admin@londwayfond.com / Admin@123

## Future Backlog (P1/P2)
- [ ] P1: Email notifications for transactions
- [ ] P1: Two-factor authentication
- [ ] P2: Transaction export (CSV/PDF)
- [ ] P2: Bill payments
- [ ] P2: Scheduled transfers
- [ ] P2: Account statements
- [ ] P2: Dark mode toggle
- [ ] P3: Mobile app (React Native)

## Stripe Integration
- Test mode enabled with `sk_test_emergent` key
- Production-ready with webhook support
- Deposit amounts: $50, $100, $250, $500, $1000, $2500 presets
- Custom amounts supported (min $10)
