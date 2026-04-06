# 💬 Real-Time Chat Application

## 📌 Overview

This is a full-stack chat application developed as part of the Adverayze technical assignment.
The application enables users to send messages, delete messages (for self and everyone), pin important messages, and experience real-time updates using polling.

---

## 🚀 Features

### 📨 Messaging System

* Send and receive messages through a chat interface
* Each message displays:

  * Content
  * Timestamp

### 🗑 Delete Functionality

* **Delete for Me**

  * Removes the message only for the current user using localStorage
* **Delete for Everyone**

  * Marks the message as deleted in the database for all users

### 📌 Pin Messages

* Users can pin/unpin messages
* Pinned messages are displayed in a dedicated section
* Deleted messages are automatically removed from pinned section

### ⚡ Real-Time Updates

* Implemented using **polling (every 2 seconds)**
* Messages update automatically without requiring manual refresh

---

## 🛠 Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas

### Deployment

* Frontend: Vercel
* Backend: Render

---

## 📂 Project Structure

```
chat-app/
│
├── backend/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── App.jsx
│   └── package.json
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 🔹 Backend Setup

```
cd backend
npm install
node server.js
```

> Note: Environment variables are required for database connection but are not included for security reasons.

---

### 🔹 Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

## 🌐 Deployed Application

* 🔗 Frontend: https://chat-app-plum-nine-68.vercel.app/
* 🔗 Backend API: https://chat-backend-muc1.onrender.com/api/messages

---

## 📡 API Endpoints

| Method | Endpoint              | Description                 |
| ------ | --------------------- | --------------------------- |
| GET    | /api/messages         | Fetch all messages          |
| POST   | /api/messages         | Send new message            |
| DELETE | /api/messages/:id     | Delete message for everyone |
| PUT    | /api/messages/pin/:id | Toggle pin message          |

---

## 🧠 Approach & Design Decisions

* Used RESTful APIs for communication between frontend and backend
* Implemented polling for real-time updates due to simplicity and time constraints
* Used MongoDB for persistent data storage
* Designed a WhatsApp-style UI using Tailwind CSS for better user experience
* Used localStorage to simulate "Delete for Me" functionality

---

## ⚖️ Tradeoffs & Assumptions

* Polling was used instead of WebSockets for simplicity
* No authentication system implemented (single-user simulation)
* Message alignment is UI-based, not user-based

---

## 🧪 Edge Case Handling

* Prevented sending empty messages
* Disabled actions on already deleted messages
* Automatically removed pinned status when a message is deleted
* Handled empty chat and empty pinned states

---

## 📈 Future Improvements

* Implement WebSockets for real-time communication
* Add user authentication and multi-user support
* Add message delivery and read indicators
* Enhance UI with animations and avatars

---

## 👩‍💻 Author

**Niharika Kancharlapalli**

---

## 🎯 Conclusion

This project fulfills all functional and technical requirements of the assignment, including message handling, deletion logic, pinning functionality, real-time updates, and a clean user interface.

---
