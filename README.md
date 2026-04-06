

# 📡 Early Alert System for Network Outages

## 🚀 Project Overview

The Early Alert System is a Node.js-based real-time monitoring system designed to detect network outages in Digital India portals and notify users and administrators instantly.

The system continuously monitors server health using HTTP requests and ICMP (ping) to identify failures, delays, and downtime.

---

## 🎯 Problem Statement

Government portals often face unstable network connectivity, which leads to:

* Service interruptions
* Poor user experience
* Lack of real-time failure detection

This project solves the problem by providing continuous monitoring and instant alert notifications.

---

## 💡 Solution

The system performs periodic checks on servers by:

* Sending HTTP requests
* Performing ICMP ping checks

It analyzes:

* Response status codes
* Network latency

If any abnormal activity is detected, alerts are triggered and sent to administrators via email.

---

## ⚙️ Features

* Real-time server monitoring
* HTTP status code tracking (200, 400, 500)
* ICMP ping-based connectivity checks
* Automated email alert system
* Modular backend architecture
* Scalable and lightweight design

---

## 🛠️ Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Tools & Protocols

* HTTP
* ICMP (Ping)
* REST APIs

---

## 🧠 System Architecture

Workflow:

1. User adds a portal to monitor
2. Backend stores data in MongoDB
3. Monitoring engine performs HTTP & ICMP checks
4. Responses are analyzed
5. Alerts are triggered if failure is detected

---

## 🔔 Alert System

The alert system is implemented using:

* monitorEngine.js for detecting failures
* emailServices.js for sending notifications

Alerts are triggered when:

* Server is down
* High response time
* HTTP errors (500, etc.)

---

## 🔐 Environment Variables

Create a `.env` file inside the backend folder:

PORT=5000

MONGO_URI=your_mongodb_connection_string

EMAIL_USER=your_email@gmail.com

EMAIL_PASS=your_email_password

---

## 📡 How It Works

Status Code → Meaning
200 → Server is working
400 → Client-side error
500 → Server error

---
🚀 How to Clone and Run the Project
1️⃣ Clone the Repository

Open terminal / command prompt and run:

git clone https://github.com/your-username/early-alert-system.git
2️⃣ Go to Project Folder
cd early-alert-system
▶️ Running the Project
⚙️ Backend Setup

Navigate to backend folder

cd backend

Install dependencies

npm install

Create .env file and add:

PORT=5000  
MONGO_URI=your_mongodb_connection_string  
EMAIL_USER=your_email@gmail.com  
EMAIL_PASS=your_email_password  

Start the server

node server.js
🎨 Frontend Setup

Method 1 (Simple)
Go to frontend/ folder
Double-click index.html

Method 2 (Recommended)

Using Visual Studio Code:

Open project folder
Right-click index.html
Click "Open with Live Server"

🌐 Open in Browser
http://localhost:5000

✅ Final Output
Backend server starts successfully
Frontend loads in browser
Monitoring system begins working

---


## 📈 Future Enhancements

* SMS and WhatsApp alerts
* Live monitoring dashboard
* Cloud deployment
* AI-based outage prediction

---

## 🤝 Contributing

1. Fork the repository
2. Create a new branch
3. Commit your changes
4. Submit a pull request

---


## 👨‍💻 Author

Jayasurya V

---

## ⭐ Support

If you like this project, give it a star on GitHub!

---

