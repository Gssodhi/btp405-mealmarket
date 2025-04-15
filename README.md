# Homemade Meals Marketplace App
**Team 8** | BTP405 Winter 2025 | [GitHub Repo](https://github.com/Gssodhi/btp405-mealmarket)  

![System Architecture](docs/architecture.png)  
*Updated Architecture Diagram (Sprint 2)*  

## 📌 Project Overview
An online marketplace connecting home chefs with customers for healthy meal subscriptions with flexible plans.  

**Key Features**:  
- 🥗 Dietary-specific plans (Vegan/Vegetarian/Non-Vegetarian/Keto)  
- ⏱️ Flexible delivery (1-2 meals/day, weekly/monthly plans)  
- 💳 Secure Stripe payments with PCI compliance  
- 🔐 JWT authentication for user accounts  
- 📱 Responsive React frontend  
- 🚚 Delivery tracking system  

---

## 🛠️ Sprint Progress

### ✅ Sprint 1 (Completed)
#### Backend (Django)
- DietPlan model with meal types and pricing  
- Admin dashboard for meal management  
- SQLite database setup  

#### Frontend (React)
- Basic meal browser UI  
- Hardcoded data demonstration  

### 🚀 Sprint 2 (Current)
#### Backend
- Stripe payment integration  
- JWT authentication endpoints  
- Subscription API with webhooks  
- CORS configuration  

#### Frontend
- Interactive subscription modal  
- Real-time price calculator  
- Payment processing flow  
- Auth context for user sessions  

---

## 📂 Project Structure
```
btp405-mealmarket/
├── backend/ # Django backend
│ ├── manage.py
│ ├── backend/ # Project settings
│ ├── meals/ # Meal plan models/API
│ ├── payments/ # Stripe integration
│ └── requirements.txt
├── frontend/ # React frontend
│ ├── public/
│ ├── src/
│ │ ├── components/ # React components
│ │ ├── context/ # Auth context
│ │ ├── styles/ # CSS modules
│ │ └── App.js
│ └── package.json
└── docs/ # Documentation
├── architecture.png
├── api_endpoints.md
├── stripe_guide.md
└── personas_user_stories.md
```

---

## 🚀 Setup Guide
1. **Clone the repo**:
   ```bash
   git clone https://github.com/Gssodhi/btp405-mealmarket.git
   cd btp405-mealmarket
   ```


---

## 🚀 Setup Guide

### 1. Prerequisites
- Python 3.8+
- Node.js 16+
- Stripe account (test mode)

### 2. Backend Setup
```bash
# Clone repository
git clone https://github.com/Gssodhi/btp405-mealmarket.git
cd btp405-mealmarket

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate       # Linux/Mac
.\venv\Scripts\activate       # Windows

# Install dependencies
cd backend
pip install -r requirements.txt

# Configure environment variables
echo "STRIPE_SECRET_KEY=sk_test_your_key" > .env
echo "DJANGO_SECRET_KEY=your_secret_key" >> .env

# Run migrations
python manage.py migrate

# Start server
python manage.py runserver

3. Frontend Setup
cd ../frontend
npm install

# Configure environment
echo "REACT_APP_STRIPE_PK=pk_test_your_key" > .env
echo "REACT_APP_API_URL=http://localhost:8000/api" >> .env

# Start development server
npm start

---
🔐 Authentication Flow
User logs in via /api/token/ endpoint

Receives JWT access/refresh tokens

Tokens stored in secure HTTP-only cookies

Protected routes validate tokens

## 📜 Documentation
- [Product Vision](docs/vision_scope.md)  
- [User Personas & Stories](docs/personas_user_stories.md)  
- [System Architecture](docs/architecture.png)  

---
💳 Payment Integration
Frontend creates subscription request

Backend generates Stripe PaymentIntent

Client confirms payment via Stripe.js

Webhook verifies payment completion

System activates meal subscription

## 👥 Team Members
- [Gurjeet] (Project Manager)  
- [amusoni] (Backend Developer)  
- [Navish] (Frontend Developer)  
- [Nidhi] (Researcher)  

Resources
Stripe Testing Docs

Django REST Framework

React Documentation

JWT Best Practices