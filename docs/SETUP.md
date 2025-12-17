# SquadUp - Project Setup Guide

Complete step-by-step guide to set up and run SquadUp locally.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB Atlas Account** - [Sign up](https://www.mongodb.com/cloud/atlas)
- **Firebase Project** - [Create project](https://console.firebase.google.com/)
- **Git** - [Download](https://git-scm.com/)

---

## Part 1: MongoDB Atlas Setup

### 1.1 Create a Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign in or create an account
3. Create a new project named "SquadUp"
4. Click "Build a Database"
5. Choose FREE tier (M0)
6. Select your preferred cloud provider and region
7. Click "Create Cluster"

### 1.2 Configure Database Access

1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Set username and password (save these!)
4. Set role to "Atlas admin"
5. Click "Add User"

### 1.3 Configure Network Access

1. Go to "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Click "Confirm"

### 1.4 Get Connection String

1. Go to "Database" → Click "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `<dbname>` with `squadup`

Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/squadup?retryWrites=true&w=majority`

---

## Part 2: Firebase Setup

### 2.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name it "SquadUp"
4. Disable Google Analytics (optional)
5. Click "Create project"

### 2.2 Enable Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Enable "Email/Password" provider
4. Enable "Google" provider
   - Add a support email
   - Click "Save"

### 2.3 Get Firebase Configuration (Frontend)

1. In Project Overview, click the web icon (</>) to add a web app
2. Register app as "SquadUp Frontend"
3. Copy the Firebase configuration object:

```javascript
{
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
}
```

### 2.4 Get Service Account (Backend)

1. Go to Project Settings (gear icon)
2. Go to "Service accounts" tab
3. Click "Generate new private key"
4. Download the JSON file
5. Keep this file secure (you'll copy its content to .env)

---

## Part 3: Backend Setup

### 3.1 Install Dependencies

```bash
cd backend
npm install
```

### 3.2 Create Environment File

Create `backend/.env` file:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/squadup?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=development

# Firebase Admin SDK (paste entire JSON from service account file)
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project-id",...}

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-to-something-random
```

**Important:** Replace all placeholder values with your actual credentials!

### 3.3 Start Backend Server

```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
✅ Firebase Admin SDK initialized
🚀 SquadUp Server running on port 5000
💬 Socket.IO ready for connections
```

If you see errors, check the Troubleshooting section at the end.

---

## Part 4: Frontend Setup

### 4.1 Install Dependencies

Open a NEW terminal window:

```bash
cd frontend
npm install
```

### 4.2 Create Environment File

Create `frontend/.env` file:

```env
# Firebase Configuration (from Step 2.3)
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdefghijklmnop

# Backend API URL
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 4.3 Start Frontend Development Server

```bash
npm run dev
```

The app should automatically open in your browser at `http://localhost:5173`

---

## Part 5: Create Your First Admin User

### 5.1 Sign Up

1. Open `http://localhost:5173/signup`
2. Fill in the form with your details
3. Select "Student" or "Expert"
4. Sign up

### 5.2 Manually Promote to Admin

Since the first user won't be admin, you need to promote manually:

**Option 1: Using MongoDB Compass or Atlas Web Interface**

1. Connect to your database
2. Find the `users` collection
3. Find your user document
4. Change `role` field from `"user"` to `"admin"`
5. Save

**Option 2: Using MongoDB Shell**

```javascript
// In MongoDB Atlas shell or Compass
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

### 5.3 Access Admin Dashboard

1. Refresh the page or log out and log in again
2. You should now see "Admin Dashboard" in the navbar
3. Click it to access admin features

---

## Part 6: Seed Sample Data (Optional)

### 6.1 Create Expert Profiles

As an admin, you can create expert profiles:

1. Sign up with a new account (use a different email)
2. Select "Expert" as role
3. After signing up, manually add expert details via the API or create a profile form

### 6.2 Manual Database Seeding

You can also manually insert sample data using MongoDB Compass/Atlas:

**Sample Expert:**
```json
{
  "userId": "ObjectId_of_user",
  "bio": "Full-stack developer with 5 years of experience",
  "expertise": ["React", "Node.js", "MongoDB"],
  "hourlyRate": 50,
  "availability": ["Monday 9-12", "Friday 14-17"],
  "rating": 4.8,
  "totalReviews": 25,
  "totalSessions": 150,
  "yearsOfExperience": 5
}
```

---

## Verification Checklist

✅ Backend server running on port 5000
✅ Frontend running on port 5173
✅ Can sign up new users
✅ Can sign in with Google
✅ Can access protected routes after login
✅ Admin can access admin dashboard
✅ Real-time chat working (may need two browser windows)
✅ Can create bookings

---

## Common Issues

### MongoDB Connection Failed
- Check if IP is whitelisted in MongoDB Atlas
- Verify connection string has correct password
- Ensure password doesn't have special characters (or URL-encode them)

### Firebase Authentication Not Working
- Verify all Firebase config values in `.env`
- Check if Email/Password and Google providers are enabled
- Ensure authorized domains include `localhost` in Firebase Console

### Backend Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### CORS Errors
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check if backend is running before starting frontend

---

## Next Steps

1. Read [API_DOCS.md](./API_DOCS.md) for API endpoint details
2. Read [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
3. Read [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues

---

**Need Help?**

If you encounter issues not covered here, check the [Troubleshooting Guide](./TROUBLESHOOTING.md).
