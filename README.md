# rangpur-hearing-center-ecommerce
A scalable multi-purpose medical eCommerce platform for Rangpur Hearing Center, focused on hearing devices, diagnostic tools, and healthcare equipment.
# 🏥 Rangpur Hearing Center – Multi-Purpose Medical eCommerce Platform

A fully admin-controlled, scalable medical eCommerce platform for Rangpur Hearing Center.  
Designed to sell hearing aids, medical equipment, and healthcare devices across Bangladesh with secure payments and courier integration.

---

## 🚀 Project Vision

To build a powerful, secure, and user-friendly medical eCommerce platform that enables:

- Complete admin control over store operations
- Seamless user shopping experience
- Secure online payments
- Integrated courier management
- Scalable architecture for future expansion

---

# 🛠 Tech Stack

- **Frontend:** Next.js (App Router)
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** Role-based Auth (Admin / User)
- **Payment Gateway:** SSLCommerz / Stripe (Planned)
- **Courier Integration:** Pathao / Steadfast / RedX (Planned)
- **Deployment:** Vercel
- **Database Hosting:** VPS (Production)

---

# 🔐 Admin Control System (Full Store Control)

## 🛒 Product Management
- Add Product
- Edit Product
- Delete Product
- Product Variants (Color, Size, Model)
- Stock Management
- SKU System
- Product Image Upload (Multiple Images)
- Featured Products
- Discount / Offer Price

## 📂 Category Management
- Add Category
- Edit Category
- Delete Category
- Subcategory System

## 🏬 Store Management
- Store Settings Control
- Banner & Slider Management
- Homepage Section Control
- Tax Settings
- Shipping Settings
- Payment Settings

## 💰 Sales Management
- Order List
- Order Details View
- Order Status Update (Pending / Processing / Shipped / Delivered / Cancelled)
- Invoice Generation
- Refund Management
- Sales Reports
- Revenue Dashboard
- Low Stock Alerts

## 👤 User Management
- View Users
- Block / Unblock Users
- Delete Users
- Role Assignment (Admin / Staff / User)
- Customer Purchase History

## 📊 Admin Dashboard
- Total Sales
- Total Orders
- Total Users
- Best Selling Products
- Monthly Revenue Chart
- Low Stock Products Alert

---

# 👤 User Experience (Customer Side)

## 🛍 Easy Shopping System
- Clean Product Listing
- Category Filtering
- Smart Search System
- Price Filter
- Product Comparison
- Wishlist System

## ⭐ Smart Review System
- Product Ratings (1–5 Star)
- Verified Purchase Review
- Review Sorting (Latest / Highest Rated)
- Helpful Review Voting

## 🛒 Cart & Checkout
- Add to Cart
- Update Quantity
- Apply Coupon Code
- Address Management
- Guest Checkout (Optional)
- Order Tracking System

---

# 💳 Payment Gateway Integration

- SSLCommerz (Bangladesh)
- Stripe (International)
- Cash on Delivery (COD)
- Online Card Payment
- Mobile Banking (Bkash / Nagad / Rocket - via gateway)

---

# 🚚 Courier Integration

- Pathao Courier
- Steadfast
- RedX
- Auto Courier Booking
- Tracking ID Generation
- Shipping Status Sync

---

# 🔒 Security Features

- Role-Based Access Control (RBAC)
- Encrypted Password Storage
- Secure API Validation
- CSRF Protection
- Environment Variable Protection
- HTTPS Enforcement (Production)
- Order Fraud Detection (Future)

---

# 📦 Inventory & Business Logic

- Automatic Stock Deduction
- Out-of-Stock Prevention
- Backorder Option
- Sales Analytics
- Profit Calculation
- Expense Tracking (Future)

---

# 🌍 SEO & Performance

- SEO Friendly URLs
- Meta Tags Control (Admin)
- Sitemap Generation
- Image Optimization
- Fast Loading (Next.js Optimization)
- Structured Data (Future)

---

# 📱 Future Expansion Roadmap

- Multi-Vendor Marketplace
- Doctor Appointment Booking System
- Subscription Based Products
- EMI Payment Option
- Advanced CRM System
- Mobile App (React Native)

---

# 📁 Project Structure

```
rangpur-hearing-center-ecommerce
│
├── app/
├── components/
├── lib/
├── prisma/
├── public/
├── hooks/
├── services/
├── admin/
└── README.md
```

---

# ⚙️ Local Development Setup

## Clone Repository

```bash
git clone https://github.com/your-username/rangpur-hearing-center-ecommerce.git
cd rangpur-hearing-center-ecommerce
```

## Install Dependencies

```bash
npm install
```

## Setup Environment Variables

Create `.env` file:

```
DATABASE_URL=
NEXTAUTH_SECRET=
PAYMENT_GATEWAY_KEY=
PAYMENT_GATEWAY_SECRET=
COURIER_API_KEY=
```

## Prisma Setup

```bash
npx prisma generate
npx prisma migrate dev
```

## Run Development Server

```bash
npm run dev
```

App runs at:

```
http://localhost:3000
```

---

# 🔄 Deployment Workflow

Local Development  
→ GitHub  
→ Vercel (Auto Deploy)  
→ Live Database (VPS)

---

# 👨‍💻 Developed For

Rangpur Hearing Center  
Bangladesh

---

# 📄 License

This project is proprietary software developed exclusively for Rangpur Hearing Center.
