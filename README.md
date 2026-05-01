# Production-Ready Real-time Chat App (MERN Stack)

A complete, scalable real-time chat application featuring WebRTC video calling, group chats, media sharing, and OTP verification.

## 🚀 Features
- **Real-time Messaging**: Low-latency chat using Socket.io.
- **Video/Audio Calls**: High-quality P2P calls via WebRTC (PeerJS).
- **Secure Auth**: JWT with Refresh tokens & OTP Email verification.
- **Media Support**: Upload images, videos, and files to Cloudinary.
- **Group Chats**: Create and manage groups with ease.
- **Modern UI**: Fully responsive Telegram/WhatsApp-like interface with Dark Mode.

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Axios.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), Socket.io.
- **Services**: Cloudinary (Media), Nodemailer (Email/OTP), PeerJS (WebRTC).

---

## 💻 Local Setup Instructions

### 1. Prerequisite
- Node.js (v18+)
- MongoDB Atlas account (for database)
- Cloudinary account (for media storage)
- Gmail App Password (for OTP emails)

### 2. Backend Setup
1. Open terminal and navigate to `backend/`
2. Run `npm install`
3. Rename `.env.example` to `.env` (or create one) and fill in your credentials.
4. Run `npm run dev` to start the server.

### 3. Frontend Setup
1. Open terminal and navigate to `frontend/`
2. Run `npm install`
3. Run `npm run dev` to start the Vite development server.
4. Open `http://localhost:5173` in your browser.

---

## 🌐 Deployment Steps (MilesWeb / VPS)

### 1. MongoDB Setup
- Go to MongoDB Atlas, create a cluster, and get your connection string.
- Whitelist the IP of your MilesWeb VPS.

### 2. Backend Deployment (Node.js VPS)
1. Login to your MilesWeb VPS via SSH.
2. Clone your repository.
3. Install Node.js if not present using NVM.
4. Go to the `backend/` folder and run `npm install --production`.
5. Set up your `.env` variables on the server.
6. Use **PM2** to keep the server running forever:
   ```bash
   npm install -g pm2
   pm2 start index.js --name "chat-backend"
   ```
7. Configure Nginx as a reverse proxy to point your domain to the port (e.g., 5000).

### 3. Frontend Deployment (Shared Hosting / VPS)
1. In your local `frontend/` folder, run `npm run build`.
2. This will generate a `dist/` folder.
3. **MilesWeb Shared Hosting**: Upload the contents of `dist/` to your `public_html` directory via FTP/File Manager.
4. **MilesWeb VPS**: You can serve the `dist/` folder using Nginx or Apache.
5. Create a `.htaccess` file (for Shared Hosting) to handle React Router:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteCond %{REQUEST_FILENAME} !-l
     RewriteRule . /index.html [L]
   </IfModule>
   ```

### 4. SSL (HTTPS)
- Use MilesWeb's Let's Encrypt tool in the cPanel or use `certbot` for VPS to enable HTTPS.
- Update your `.env` variables (CLIENT_URL, etc.) to use `https://`.

---

## 🛡️ Security Best Practices
- **Password Hashing**: Bcrypt with salt rounds.
- **JWT**: Short-lived access tokens + long-lived refresh tokens.
- **CORS**: Restricted origins.
- **Rate Limiting**: Prevent brute force on API routes.
- **Input Validation**: Sanitized and validated using Joi/Express-validator.
