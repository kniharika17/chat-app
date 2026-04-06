# Real-Time Chat Application

## Overview
A full-stack chat application supporting messaging, delete options, and pinning with real-time updates using polling.

## Features
- Send & receive messages
- Delete for Me / Delete for Everyone
- Pin messages
- Real-time updates (polling)

## Tech Stack
- Frontend: React (Vite)
- Backend: Node.js, Express
- Database: MongoDB Atlas
- Deployment: Vercel + Render

## Setup Instructions

### Backend
cd backend
npm install
node server.js

### Frontend
cd frontend
npm install
npm run dev

## API Endpoints
- GET /api/messages
- POST /api/messages
- DELETE /api/messages/:id
- PUT /api/messages/pin/:id

## Approach
- Used REST APIs for communication
- Implemented polling for real-time updates
- Used MongoDB for persistent storage

## Tradeoffs
- Polling instead of WebSockets due to time constraints
- Simple UI for faster implementation
