# 💊 MediTrack – Real-Time Medicine Finder & Inventory Manager (Frontend)

**MediTrack** is a web application designed to make it easier for users to **find medicines in real-time** across nearby pharmacies, while also helping **pharmacy owners manage their inventory** more efficiently. Built using **HTML, CSS, JavaScript**, and **Firebase**, the app ensures a seamless, responsive experience for both user types.

---

## 🧠 Overview

MediTrack addresses two key problems:

- ✅ **Users** often struggle to locate specific medicines quickly.
- ✅ **Pharmacy Owners** need a way to track stock levels and avoid expiry-related losses.

MediTrack solves these with a simple, fast, and effective system that connects both parties in real-time.

---

## ✨ Key Features

### For Users:
- 🔎 Search medicines and check which nearby pharmacies have them in stock
- 📱 Clean, responsive interface built with HTML/CSS/JS
- 📍 (Optional) Location-based filtering using Geolocation API

### For Pharmacy Owners:
- 🔐 Firebase Authentication (Email & Password)
- 📦 Add/edit/delete stock items in inventory
- ⚠️ Get alerted when medicines are nearing expiry

---

## 🛠 Tech Stack

| Technology    | Purpose                              |
|---------------|--------------------------------------|
| **HTML5**     | Page structure                       |
| **CSS3**      | Styling and layout                   |
| **JavaScript**| App logic and Firebase integration   |
| **Firebase**  | Authentication, Firestore/Realtime DB|

---

## 🔐 Firebase Auth Integration

- User sign-up/login/logout with Firebase Email/Password Auth
- Auth-protected pages (e.g., only pharmacy owners can access dashboard)
- Session management (auto-login, logout on expiry)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/not-amarnath/meditrack.git
cd meditrack
