# 🚀 PujaOne Backend - Complete API Curl Guide

**Base URL:** `http://localhost:3000/api`  
**Swagger Docs:** `http://localhost:3000/api/docs`

---

## 📚 Table of Contents

1. [Authentication APIs](#-authentication-apis)
2. [User APIs](#-user-apis)
3. [Puja APIs](#-puja-apis)
4. [Puja Category APIs](#-puja-category-apis)
5. [Puja Items APIs](#-puja-items-apis)
6. [Puja Addons APIs](#-puja-addons-apis)
7. [Puja Benefits APIs](#-puja-benefits-apis)
8. [Puja Pricing APIs](#-puja-pricing-apis)
9. [Puja Gallery APIs](#-puja-gallery-apis)
10. [Puja Requirements APIs](#-puja-requirements-apis)
11. [Booking APIs](#-booking-apis)
12. [Purohit APIs](#-purohit-apis)
13. [Purohit Availability APIs](#-purohit-availability-apis)
14. [Samagri Kits APIs](#-samagri-kits-apis)
15. [Payment APIs](#-payment-apis)
16. [Invoice APIs](#-invoice-apis)
17. [Admin Dashboard APIs](#-admin-dashboard-apis)
18. [DevTools APIs](#-devtools-apis)

---

## 🔐 Authentication APIs

### 1. Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone": "9876543210",
    "password": "secure_password"
  }'
```

### 2. Login with Phone + Password
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "9876543210",
    "password": "secure_password"
  }'
```

### 3. Send OTP
```bash
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "9876543210"
  }'
```
**Note:** In DEV environment, OTP is `999999`

### 4. Verify OTP & Login/Register
```bash
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "9876543210",
    "otp": "999999"
  }'
```

---

## 👤 User APIs

### 1. Get My Profile (Protected)
```bash
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 2. Update/Complete My Profile (Protected)
```bash
curl -X PUT http://localhost:3000/api/users/me/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "address": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  }'
```

### 3. Get My Saved Addresses (Protected)
```bash
curl -X GET http://localhost:3000/api/users/me/addresses \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Get User by ID (Admin/Internal)
```bash
curl -X GET http://localhost:3000/api/users/{userId} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🕉️ Puja APIs

### 1. List Pujas (Lightweight - Public)
```bash
curl -X GET "http://localhost:3000/api/puja?limit=20&offset=0&category=cat_id&search=pujaname&featured=true"
```

### 2. Get Full Puja Details (Public)
```bash
# Get single puja with full details
curl -X GET "http://localhost:3000/api/puja/details?puja_id=puja_id"

# Get all pujas under a category with full details
curl -X GET "http://localhost:3000/api/puja/details?category_id=category_id"
```

### 3. Admin: Create Puja (Protected)
```bash
curl -X POST http://localhost:3000/api/puja/admin/create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Durga Puja",
    "description": "Worship of Goddess Durga",
    "category_id": "cat_id",
    "duration_days": 9,
    "is_featured": true
  }'
```

### 4. Admin: Update Puja (Protected)
```bash
curl -X PATCH http://localhost:3000/api/puja/admin/{pujaId} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Puja Name",
    "description": "Updated description",
    "is_featured": false
  }'
```

---

## 📂 Puja Category APIs

### 1. Create Puja Category (Admin - Protected)
```bash
curl -X POST http://localhost:3000/api/puja-category \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Festival Pujas",
    "description": "Pujas related to festivals"
  }'
```

### 2. List All Categories (Public)
```bash
curl -X GET http://localhost:3000/api/puja-category
```

### 3. Get Category by ID (Public)
```bash
curl -X GET http://localhost:3000/api/puja-category/{categoryId}
```

### 4. Update Category (Admin - Protected)
```bash
curl -X PATCH http://localhost:3000/api/puja-category/{categoryId} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Category Name",
    "description": "Updated description"
  }'
```

### 5. Delete Category (Admin - Protected)
```bash
curl -X DELETE http://localhost:3000/api/puja-category/{categoryId} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📍 Puja Items APIs

### 1. Admin: Add Item to Puja (Protected)
```bash
curl -X POST http://localhost:3000/api/puja-items/admin/{pujaId} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Flowers",
    "description": "Fresh flowers for offering",
    "quantity": 100,
    "unit": "pieces"
  }'
```

### 2. Get Items for a Puja (Public)
```bash
curl -X GET http://localhost:3000/api/puja-items/puja/{pujaId}
```

### 3. Admin: Update Item (Protected)
```bash
curl -X PATCH http://localhost:3000/api/puja-items/admin/{itemId} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Item Name",
    "quantity": 150
  }'
```

### 4. Admin: Delete Item (Protected)
```bash
curl -X DELETE http://localhost:3000/api/puja-items/admin/{itemId} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 5. Admin: Add Items in Bulk to Puja (Protected)
```bash
curl -X POST http://localhost:3000/api/puja/{pujaId}/items \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "name": "Flowers",
      "description": "Fresh flowers",
      "quantity": 100,
      "unit": "pieces"
    },
    {
      "name": "Incense",
      "description": "Fragrant incense sticks",
      "quantity": 50,
      "unit": "pieces"
    }
  ]'
```

---

## 🎁 Puja Addons APIs

### 1. List Addons for a Puja (Public)
```bash
curl -X GET http://localhost:3000/api/puja-addons/{pujaId}
```

### 2. Admin: Create Addon (Protected)
```bash
curl -X POST http://localhost:3000/api/puja-addons/admin \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "puja_id": "puja_id",
    "name": "Premium Prasad",
    "description": "Delicious prasad offering",
    "price": 500
  }'
```

### 3. Admin: Update Addon (Protected)
```bash
curl -X PATCH http://localhost:3000/api/puja-addons/admin/{addonId} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Addon Name",
    "price": 600
  }'
```

### 4. Admin: Delete Addon (Protected)
```bash
curl -X DELETE http://localhost:3000/api/puja-addons/admin/{addonId} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 5. Admin: Add Addons in Bulk to Puja (Protected)
```bash
curl -X POST http://localhost:3000/api/puja/{pujaId}/addons \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "name": "Prasad Addon",
      "description": "Special prasad",
      "price": 500
    },
    {
      "name": "Flowers Addon",
      "description": "Extra flowers",
      "price": 300
    }
  ]'
```

---

## ✨ Puja Benefits APIs

### 1. Admin: Create Benefit (Protected)
```bash
curl -X POST http://localhost:3000/api/puja-benefits/admin/{pujaId} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "benefit": "Brings prosperity and wealth"
  }'
```

### 2. Get Benefits for a Puja (Public)
```bash
curl -X GET http://localhost:3000/api/puja-benefits/{pujaId}
```

### 3. Admin: Update Benefit (Protected)
```bash
curl -X PATCH http://localhost:3000/api/puja-benefits/admin/{benefitId} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "benefit": "Updated benefit description"
  }'
```

### 4. Admin: Delete Benefit (Protected)
```bash
curl -X DELETE http://localhost:3000/api/puja-benefits/admin/{benefitId} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 💰 Puja Pricing APIs

### 1. Admin: Create Pricing Option (Protected)
```bash
curl -X POST http://localhost:3000/api/puja-pricing/admin/{pujaId} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Basic Package",
    "description": "Basic puja package",
    "price": 5000
  }'
```

### 2. Get Pricing Options for Puja (Public)
```bash
curl -X GET http://localhost:3000/api/puja-pricing/{pujaId}
```

### 3. Admin: Update Pricing Option (Protected)
```bash
curl -X PATCH http://localhost:3000/api/puja-pricing/admin/{pricingId} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Package Name",
    "price": 6000
  }'
```

### 4. Admin: Delete Pricing Option (Protected)
```bash
curl -X DELETE http://localhost:3000/api/puja-pricing/admin/{pricingId} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 5. Admin: Add Addon to Package (Protected)
```bash
curl -X POST http://localhost:3000/api/puja-pricing/admin/{pricingId}/addons/{addonId} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 6. Admin: Remove Addon from Package (Protected)
```bash
curl -X DELETE http://localhost:3000/api/puja-pricing/admin/{pricingId}/addons/{addonId} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 7. Get Addons for Pricing Package (Public)
```bash
curl -X GET http://localhost:3000/api/puja-pricing/{pricingId}/addons
```

### 8. Admin: Add Requirement to Package (Protected)
```bash
curl -X POST http://localhost:3000/api/puja-pricing/admin/{pricingId}/requirements/{requirementId} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 9. Admin: Remove Requirement from Package (Protected)
```bash
curl -X DELETE http://localhost:3000/api/puja-pricing/admin/{pricingId}/requirements/{requirementId} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 10. Get Requirements for Pricing Package (Public)
```bash
curl -X GET http://localhost:3000/api/puja-pricing/{pricingId}/requirements
```

---

## 🖼️ Puja Gallery APIs

### 1. Admin: Upload Image (Protected)
```bash
curl -X POST http://localhost:3000/api/puja-gallery/admin/{pujaId} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "image=@/path/to/image.jpg" \
  -F "sort_order=1"
```

### 2. Get Gallery Images for Puja (Public)
```bash
curl -X GET http://localhost:3000/api/puja-gallery/{pujaId}
```

### 3. Admin: Delete Image (Protected)
```bash
curl -X DELETE http://localhost:3000/api/puja-gallery/admin/{imageId} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📋 Puja Requirements APIs

### 1. Admin: Add Requirement to Puja (Protected)
```bash
curl -X POST http://localhost:3000/api/puja-requirements/{pujaId} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bathing Area",
    "description": "Clean bathing area required"
  }'
```

### 2. Get Requirements for Puja (Public)
```bash
curl -X GET http://localhost:3000/api/puja-requirements/puja/{pujaId}
```

### 3. Admin: Update Requirement (Protected)
```bash
curl -X PATCH http://localhost:3000/api/puja-requirements/{requirementId} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Requirement",
    "description": "Updated description"
  }'
```

### 4. Admin: Delete Requirement (Protected)
```bash
curl -X DELETE http://localhost:3000/api/puja-requirements/{requirementId} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📅 Booking APIs

### 1. User: Create Booking (Protected)
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "puja_id": "puja_id",
    "pricing_id": "pricing_id",
    "booking_date": "2025-12-26",
    "address": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  }'
```

### 2. Get Booking Details (Protected)
```bash
curl -X GET http://localhost:3000/api/bookings/{bookingId} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. Admin: Get All Bookings (Protected)
```bash
curl -X GET http://localhost:3000/api/bookings \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Admin: Update Booking Status (Protected)
```bash
curl -X PATCH http://localhost:3000/api/bookings/{bookingId}/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "CONFIRMED"
  }'
```

### 5. Admin: Assign Purohit to Booking (Protected)
```bash
curl -X PATCH http://localhost:3000/api/bookings/{bookingId}/assign-purohit \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "purohit_id": "purohit_id"
  }'
```

### 6. User: Add Custom Addon to Booking (Protected)
```bash
curl -X PATCH http://localhost:3000/api/bookings/{bookingId}/add-addon \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "addon_id": "addon_id"
  }'
```

### 7. User: Cancel Booking (Protected)
```bash
curl -X POST http://localhost:3000/api/bookings/{bookingId}/cancel \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Schedule conflict"
  }'
```

---

## 🧑‍🔬 Purohit APIs

### 1. Admin: Create Purohit (One-shot with User - Protected)
```bash
curl -X POST http://localhost:3000/api/purohit/admin/create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pandit Sharma",
    "phone": "9876543210",
    "email": "pandit@example.com",
    "specializations": ["Durga Puja", "Navratri"],
    "experience_years": 15,
    "bio": "Expert in North Indian rituals"
  }'
```

### 2. List All Purohits (Public)
```bash
curl -X GET http://localhost:3000/api/purohit
```

### 3. Get Purohit Details (Public)
```bash
curl -X GET http://localhost:3000/api/purohit/{purohitId}
```

### 4. Admin: Update Purohit (Protected)
```bash
curl -X PATCH http://localhost:3000/api/purohit/{purohitId} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "specializations": ["Durga Puja", "Navratri", "Grahapravesh"],
    "experience_years": 16
  }'
```

### 5. Purohit/Admin: Update Availability (Protected)
```bash
curl -X PATCH http://localhost:3000/api/purohit/{purohitId}/availability \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "available": true
  }'
```

### 6. Admin/Purohit: Upload Profile Picture (Protected)
```bash
curl -X POST http://localhost:3000/api/purohit/{purohitId}/avatar \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/profile.jpg"
```

### 7. Get Purohit Avatar URL (Public)
```bash
curl -X GET http://localhost:3000/api/purohit/{purohitId}/avatar
```

---

## 📆 Purohit Availability APIs

### 1. Purohit: Add Availability (Protected)
```bash
curl -X POST http://localhost:3000/api/purohit-availability/add \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-12-26",
    "time_slots": ["09:00-11:00", "14:00-16:00"]
  }'
```

### 2. Purohit: Block Date (Protected)
```bash
curl -X POST http://localhost:3000/api/purohit-availability/block-date \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-12-26",
    "reason": "Personal emergency"
  }'
```

### 3. Check Purohit Availability (Public)
```bash
curl -X POST http://localhost:3000/api/purohit-availability/check \
  -H "Content-Type: application/json" \
  -d '{
    "purohit_id": "purohit_id",
    "date": "2025-12-26"
  }'
```

### 4. Purohit: Get Calendar (Protected)
```bash
curl -X GET "http://localhost:3000/api/purohit-availability/calendar?month=12&year=2025" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 5. Admin: Get Admin Calendar (Protected)
```bash
curl -X GET "http://localhost:3000/api/purohit-availability/admin/calendar?month=12&year=2025" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🧺 Samagri Kits APIs

### 1. Admin: Create Samagri Kit (Protected)
```bash
curl -X POST http://localhost:3000/api/samagri-kits/admin/create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "puja_id": "puja_id",
    "name": "Complete Durga Puja Kit",
    "description": "All samagri for Durga Puja",
    "price": 1500
  }'
```

### 2. Get Kits for Puja (Public)
```bash
curl -X GET http://localhost:3000/api/samagri-kits/{pujaId}
```

### 3. Admin: Update Kit (Protected)
```bash
curl -X PATCH http://localhost:3000/api/samagri-kits/admin/{kitId} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Kit Name",
    "price": 1800
  }'
```

### 4. Admin: Delete Kit (Protected)
```bash
curl -X DELETE http://localhost:3000/api/samagri-kits/admin/{kitId} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 5. Admin: Add Item to Kit (Protected)
```bash
curl -X POST http://localhost:3000/api/samagri-kits/admin/add-item \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "kit_id": "kit_id",
    "name": "Incense Sticks",
    "quantity": 50,
    "unit": "pieces"
  }'
```

### 6. Admin: Update Kit Item (Protected)
```bash
curl -X PATCH http://localhost:3000/api/samagri-kits/admin/item/{itemId} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Item",
    "quantity": 75
  }'
```

### 7. Admin: Delete Kit Item (Protected)
```bash
curl -X DELETE http://localhost:3000/api/samagri-kits/admin/item/{itemId} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 💳 Payment APIs

### 1. Razorpay Webhook (Endpoint - Signature Verification)
```bash
# This is called by Razorpay servers - not for manual testing
# POST /api/payments/webhook/razorpay
# Razorpay will send: x-razorpay-signature header + raw JSON body
```

**Webhook Events Handled:**
- `payment.captured` - Payment success
- `refund.processed` - Refund success

---

## 📄 Invoice APIs

### 1. Generate Invoice (Protected)
```bash
curl -X GET http://localhost:3000/api/invoice/{bookingId} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📊 Admin Dashboard APIs

### 1. Get Dashboard Summary (Protected)
```bash
curl -X GET http://localhost:3000/api/admin/dashboard/summary \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 2. Get Monthly Bookings Chart (Protected)
```bash
curl -X GET http://localhost:3000/api/admin/dashboard/charts/bookings \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. Get Today's Puja Alerts (Protected)
```bash
curl -X GET http://localhost:3000/api/admin/dashboard/alerts/today-puja \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🛠️ DevTools APIs

### 1. Decode JWT Token (Development Use Only)
```bash
curl -X POST http://localhost:3000/api/dev/decode-token \
  -H "Content-Type: application/json" \
  -d '{
    "token": "YOUR_JWT_TOKEN"
  }'
```

---

## 🔗 Helper Endpoints

### 1. Root Health Check
```bash
curl -X GET http://localhost:3000/api
```

### 2. Swagger UI
Visit: `http://localhost:3000/api/docs`

---

## 🔑 Important Notes

### Authentication Token Usage
- Most endpoints require `Authorization: Bearer {JWT_TOKEN}`
- Token obtained from `/auth/register` or `/auth/login` response
- Token includes `sub` (user ID), `role` (ADMIN/PUROHIT/USER)
- Add to all protected endpoints in the header

### Admin Endpoints
- Require `Authorization: Bearer {ADMIN_TOKEN}`
- Require `Roles('ADMIN')` decorator
- Include endpoints with `/admin/` prefix

### Public Endpoints
- No authentication required
- Include `@Public()` decorator
- Perfect for frontend (list, details, search)

### Request Body Format
- All POST/PATCH requests use `application/json`
- File uploads use `multipart/form-data`
- Query parameters for GET requests

### Error Handling
- 400: Bad Request (validation error)
- 401: Unauthorized (missing/invalid token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 500: Server Error

---

## 🧪 Quick Testing Workflow

### 1. Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "phone": "9876543210", "password": "test123"}'
```
Get the `access_token` from response.

### 2. Complete Profile
```bash
curl -X PUT http://localhost:3000/api/users/me/profile \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"address": "123 Main St", "city": "Mumbai", "state": "Maharashtra", "pincode": "400001"}'
```

### 3. Browse Pujas
```bash
curl -X GET "http://localhost:3000/api/puja?limit=10&offset=0"
```

### 4. Create Booking
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"puja_id": "PUJA_ID", "pricing_id": "PRICING_ID", "booking_date": "2025-12-26", ...}'
```

---

## 📌 Environment Variables
Check `.env` file for:
- `PORT` - Server port (default: 3000)
- `JWT_SECRET` - JWT signing secret
- `RAZORPAY_KEY_ID` - Razorpay public key
- `RAZORPAY_KEY_SECRET` - Razorpay secret key
- `SUPABASE_URL` - Database URL
- Database credentials

---

**Last Updated:** December 26, 2025  
**API Version:** 1.0  
**Framework:** NestJS + TypeScript
