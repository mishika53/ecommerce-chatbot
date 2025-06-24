# 🛒 Uplyft E-Commerce Chatbot

Welcome to the official repository for the **Uplyft Full Stack Internship Case Study (Internshala, June 2025)**. This project demonstrates a complete full-stack e-commerce chatbot application.

---

## 📚 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [License](#license)

---

## 📖 Overview

This chatbot acts as a virtual shopping assistant. It can:

- Answer user queries
- Display trending or filtered products
- Track orders
- Provide customer support options

All data is stored and served from a Flask backend with SQLite, and the UI is built using React with Tailwind CSS.

---[readme.md](https://github.com/user-attachments/files/20877478/readme.md)


## ✅ Features

- Real-time product search and recommendation
- Order status checking with mock data
- Natural chatbot-style UI
- Message timestamps
- Options and suggestions handling
- Chat history saved in database

---

## 💻 Tech Stack

- **Frontend**: React (Vite + TypeScript), Tailwind CSS
- **Backend**: Flask, Flask-CORS, Flask-SQLAlchemy
- **Database**: SQLite

---

## 📁 Project Structure

```
project/
├── backend/
│   ├── app.py                # Flask backend with chat, product, order APIs
│   ├── ecommerce_chatbot.db # SQLite database
│   ├── test_api.py          # API unit test script
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWindow.tsx
│   │   │   └── ProductCard.tsx
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   └── Chat.tsx
│   │   └── utils/
│   │       └── auth.ts
├── README.md
├── requirements.txt
└── package.json
```

---

## ⚙️ Setup Instructions

### 🔧 Backend

```bash
cd backend
python -m venv venv
# Activate it:
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux

pip install -r requirements.txt
python app.py
```

Runs at: [http://localhost:8000](http://localhost:8000)

### 🎨 Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs at: [http://localhost:5173](http://localhost:5173)

---

## 🔌 API Endpoints

| Method | Endpoint              | Description              |
| ------ | --------------------- | ------------------------ |
| POST   | `/chat`               | Handle chatbot messages  |
| GET    | `/products`           | Fetch all products       |
| GET    | `/products/search?q=` | Search products by query |
| GET    | `/orders/<id>`        | Track order by ID        |

---

## 🧪 Tests

To run backend tests:

```bash
cd backend
python test_api.py
```

---

## 🖼️ Screenshots

> 💬 Add screenshots here showing the chatbot UI, product cards, and order tracking result in the chat.

---

## 📄 License

This project is created as part of the Uplyft Full Stack Internship Case Study. You may use it for educational or demonstration purposes.

---

## 🙌 Credits

Created by **Mishi**, with guidance and hard work during the Uplyft internship challenge.

