# 🛠️ Muqaddas Server

The **Muqaddas Server** is a secure backend built with **Node.js** and **Express** to support spiritual travel experiences like Hajj and Umrah. It delivers **RESTful APIs** for managing packages, bookings, and users, with robust **JWT-based authentication** and **Firebase Admin** integration. Designed for reliability and simplicity, it powers the Muqaddas platform with purpose-driven performance.

---

## 🧩 Project Overview

This backend is responsible for:

- Managing package listings and bookings
- Securing routes using Firebase-admin and JWT
- Handling environment configurations with `dotenv`
- Seamlessly integrating with the Muqaddas client

---

## 🔗 Frontend Companion

👉 [Muqaddas Client Repository](https://github.com/ameerhamzahd/muqaddas)

---

## 🚀 Features

- 📦 REST API with CRUD operations
- 🔐 Firebase Admin authentication & JWT-based token system
- 🌐 CORS-enabled for frontend-backend interaction
- 🌱 Environment configuration with `.env`
- ⚙️ Easy deployment with `vercel.json`

---

## ⚙️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: Firebase Admin SDK
- **Environment Config**: dotenv
- **Deployment**: Vercel

---

## 📦 NPM Packages Used
        
### Backend

| Package           | Purpose                                           |
|-------------------|---------------------------------------------------|
| `cors`            | Enable cross-origin requests                      |
| `dotenv`          | Manage environment variables                      |
| `express`         | Server setup and API endpoints                    |
| `firebase-admin`  | Firebase server-side integration                  |
| `mongodb`         | MongoDB client and query management               |

---

## 🛠️ Installation & Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ameerhamzahd/muqaddas-server.git
   cd muqaddas-server

2. **Install dependencies:**:
    ```bash
    npm install

3. **Set up environment variables**:
    Create a .env file and add your variables:
    ```env
    DB_USERNAME=your_database_username
    DB_PASSWORD=your_database_password
    ACCESS_TOKEN_SECRET=your_jwt_secret

4. **Run locally**:
    ```bash
    nodemon index.js

---

## 🚀 Deployment

1. **Install Vercel CLI (if not already)**:
    ```bash
    npm install -g vercel

2. **Login to your Vercel account**:
    ```bash
    vercel login

3. **Deploy your server**:
    ```bash
    vercel --prod

---

## 📬 Contact

For issues or suggestions, please contact: ameerhamzah.daiyan@gmail.com

---

## 📄 License

-This project is licensed under the MIT License.

---

## ✨ Acknowledgements

Thanks to Firebase, Tailwind, and the React ecosystem for powering this project.

---