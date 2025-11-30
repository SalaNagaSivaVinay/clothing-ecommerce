🛍️ Clothing E-Commerce Website

Full-Stack MERN Assignment
Author: Sala Naga Siva Vinay

📌 Project Overview

This is a fully functional Clothing E-Commerce Application built using:

Frontend: React.js (Vite)

Backend: Node.js + Express.js

Database: MongoDB

Authentication: JWT (JSON Web Token)

The project includes:

✔ Product Listing
✔ Product Details Page
✔ Add to Cart
✔ Order Button
✔ Login & Register
✔ Fully responsive layout
✔ Filters (category, size, search, price range)
✔ Backend APIs for products, users, and auth

🛠️ Tech Stack
Frontend

React.js (Vite)
Axios
React Router
CSS Flex & Grid
Context API / LocalStorage

Backend

Node.js
Express.js
MongoDB + Mongoose
JWT Authentication
CORS Enabled

📦 Installation and Setup
1️⃣ Clone the repository
git clone https://github.com/SalaNagaSivaVinay/clothing-ecommerce.git

2️⃣ Install backend dependencies
cd backend
npm install

3️⃣ Install frontend dependencies
cd ../frontend
npm install

🔑 Environment Variables
Backend .env
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key

Frontend .env
VITE_API_URL=http://localhost:5000/api

▶️ Running the Project
Start backend
cd backend
npm start

Start frontend
cd frontend
npm run dev

📡 API Endpoints
Products
GET /api/products
GET /api/products/:id

Auth
POST /api/auth/register
POST /api/auth/login

✨ Features Implemented

🛒 Product Module

List all products
Product search
Category filter
Size filter
Price filter
Product detail page

👤 Authentication

Register new user
Login user
JWT-based secure routes

🧺 User Interactions

Add to Cart
Place Order

🎨 UI Improvements

Full card clickable navigation
Centered layout
Responsive design
Clean product grid spacing

📌 Final Notes

This project was created as part of an assignment.
All features work both locally and after deployment.

If you face any errors, feel free to reach out.