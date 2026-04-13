# 🛍️ BuyMe - Premium MERN E-Commerce Platform

![MERN Stack](https://img.shields.io/badge/MERN-Stack-blue?style=for-the-badge&logo=mongodb)
![React](https://img.shields.io/badge/React-19.x-61dafb?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Deployed Status](https://img.shields.io/badge/Deployed-Live-success?style=for-the-badge)

BuyMe is a modern, responsive, and fully-featured full-stack e-commerce application built to deliver a premium shopping experience. It features an integrated AI Assistant, live search functionality, role-based dashboards, and a beautiful custom UI.

🌐 **Live Demo:** [https://buyme.pages.dev/](https://buyme.pages.dev/)
⚙️ **Backend API:** [Render Hosted Service](https://buyme-8o2g.onrender.com)

---

## ✨ Key Features

*   **Modern Premium UI/UX:** Built entirely with custom CSS, utilizing glassmorphism, dynamic grids, and `framer-motion` for buttery-smooth micro-animations.
*   **🤖 AI Customer Support:** Integrated HuggingFace LLM Chatbot equipped with real-time knowledge of the store's inventory, ready to answer customer queries.
*   **⚡ Real-Time Live Search:** Debounced type-ahead search with drop-down product suggestions, thumbnails, and quick navigation.
*   **🔐 Authentication & Authorization:** JWT-based secure login, registration, and role-based access control (Admin vs. Customer).
*   **💳 Secure Checkout:** Fully integrated Stripe payment gateway logic.
*   **📊 Dashboards:** 
    *   **User Dashboard:** Manage profile details, view order history, and update avatars dynamically.
    *   **Admin Dashboard:** Dedicated portal for comprehensive management of inventory, product listings, user accounts, and platform analytics.
*   **📱 Fully Responsive:** Optimized seamlessly for desktop, tablet, and mobile viewing.

---

## 🛠️ Tech Stack

### Frontend
*   **React (v19)** - Core UI framework
*   **React Router v7** - Client-side routing
*   **Framer Motion** - Complex animations and page transitions
*   **Axios** - Intercepted HTTP client for secure API requests
*   **Vanilla CSS** - Highly customized stylesheet architecture

### Backend
*   **Node.js & Express.js** - RESTful API architecture
*   **MongoDB & Mongoose** - NoSQL Database and object modeling
*   **JSON Web Tokens (JWT)** - Stateless authentication
*   **Bcrypt.js** - Password hashing
*   **HuggingFace Inference API** - Localized AI LLM integration

### Deployment Providers
*   **Frontend:** Cloudflare Pages
*   **Backend:** Render
*   **Database:** MongoDB Atlas

---

## 🚀 Local Development Setup

To run this project locally on your machine, follow these steps:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [Git](https://git-scm.com/) installed on your machine. You will also need a MongoDB Atlas cluster URI.

### 1. Clone the repository
```bash
git clone https://github.com/Bijon2002/BuyMe.git
cd BuyMe
```

### 2. Backend Setup
```bash
cd Backend
npm install
```
Create a `.env` file in the `Backend` directory and add the following variables:
```env
PORT=8000
NODE_ENV=development
DB_URL=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
REFRESH_TOKEN_SECRET=your_refresh_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
HUGGINGFACE_API_KEY=your_huggingface_token
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window / tab.
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
REACT_APP_API_URL=http://localhost:8000/api/v1
```
Start the React App:
```bash
npm run dev
```

The application will now be running at `http://localhost:3000`.

---

## 🏗️ Project Structure

```text
BuyMe/
├── Backend/                 # Express REST API Server
│   ├── Controller/          # Business logic (Products, Users, Chatbot)
│   ├── Models/              # Mongoose DB Schemas
│   ├── Routes/              # API endpoints definitions
│   ├── middleware/          # Auth, Error handlers
│   └── app.js               # Entry point
│
└── frontend/                # React Client
    ├── public/              # Static assets and index.html
    └── src/                 
        ├── components/      # Reusable UI elements (Navbar, Cards, Chatbot)
        ├── pages/           # Route views (Home, Dashboards, Checkout)
        ├── api/             # Axios configs and API wrappers
        └── App.css          # Core design system
```

---

## 👨‍💻 Author

**Bijosilin Marisilin**
* Machine Learning Researcher & Software Engineering Undergraduate
* GitHub: [@Bijon2002](https://github.com/Bijon2002)

---

> If you easily found this project helpful or inspiring, please consider leaving a ⭐ on the repository!
