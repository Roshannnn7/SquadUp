# SquadUp - Deployment Guide

Deploy SquadUp to production using Vercel (frontend) and Render (backend).

---

## Prerequisites

- [ ] Completed local setup and testing
- [ ] GitHub account
- [ ] Vercel account - [Sign up](https://vercel.com)
- [ ] Render account - [Sign up](https://render.com)
- [ ] MongoDB Atlas production cluster
- [ ] Firebase project (same one from development)

---

## Part 1: Prepare for Deployment

### 1.1 Push Code to GitHub

```bash
# Initialize git (if not already done)
git init

# Create .gitignore files
# Already created for backend and frontend

# Add all files
git add .

# Commit
git commit -m "Initial commit - SquadUp application"

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/squadup.git
git branch -M main
git push -u origin main
```

### 1.2 Update MongoDB for Production

1. In MongoDB Atlas, ensure you have a production cluster (or use the same one)
2. Update Network Access to allow connections from anywhere: `0.0.0.0/0`
   - For better security, add Render's IP ranges after deployment
3. Get your connection string (will use in Render environment variables)

---

## Part 2: Deploy Backend to Render

### 2.1 Create Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name:** `squadup-backend`
   - **Region:** Choose closest to your users
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free

### 2.2 Add Environment Variables

Click "Advanced" → Add environment variables:

```
MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/squadup?retryWrites=true&w=majority
PORT = 5000
NODE_ENV = production
FIREBASE_SERVICE_ACCOUNT_KEY = {"type":"service_account",...}
FRONTEND_URL = https://your-frontend-url.vercel.app
JWT_SECRET = your-production-secret-generate-new-one
```

**Important:**
- Replace MongoDB connection string with your actual credentials
- `FRONTEND_URL` will be updated after frontend deployment
- Generate a new, strong `JWT_SECRET` for production
- Paste your entire Firebase service account JSON

### 2.3 Deploy

1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Once deployed, copy your backend URL: `https://squadup-backend.onrender.com`

### 2.4 Verify Backend

Visit `https://squadup-backend.onrender.com/`

You should see:
```json
{
  "success": true,
  "message": "SquadUp API is running! 🚀",
  "version": "1.0.0"
}
```

---

## Part 3: Deploy Frontend to Vercel

### 3.1 Create Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `dist` (auto-detected)

### 3.2 Add Environment Variables

Add these environment variables:

```
VITE_FIREBASE_API_KEY = your-api-key
VITE_FIREBASE_AUTH_DOMAIN = your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID = your-project-id
VITE_FIREBASE_STORAGE_BUCKET = your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID = 123456789
VITE_FIREBASE_APP_ID = 1:123456789:web:abc123
VITE_API_URL = https://squadup-backend.onrender.com/api
VITE_SOCKET_URL = https://squadup-backend.onrender.com
```

**Important:** Replace `squadup-backend.onrender.com` with your actual Render backend URL

### 3.3 Deploy

1. Click "Deploy"
2. Wait for deployment (2-3 minutes)
3. Once deployed, copy your frontend URL: `https://squadup.vercel.app`

---

## Part 4: Update Configuration

### 4.1 Update Backend CORS

1. Go back to Render Dashboard
2. Find your backend service
3. Go to "Environment"
4. Update `FRONTEND_URL` to your Vercel URL
5. Click "Save Changes"
6. Service will auto-redeploy

### 4.2 Update Firebase Authorized Domains

1. Go to Firebase Console
2. Navigate to Authentication → Settings → Authorized domains
3. Add your Vercel domain: `squadup.vercel.app`
4. Click "Add domain"

---

## Part 5: Test Production Deployment

### 5.1 Functionality Checklist

✅ Visit your Vercel URL
✅ Sign up with a new account
✅ Sign in with Google
✅ Navigate to Projects page
✅ Navigate to Experts page
✅ Try booking a session
✅ Test real-time chat (open two browser windows)
✅ Admin dashboard (if you have admin access)

### 5.2 Monitor Logs

**Backend Logs (Render):**
1. Go to Render Dashboard → Your service
2. Click "Logs" tab
3. Monitor for errors

**Frontend Logs (Vercel):**
1. Open browser DevTools → Console
2. Check for errors

---

## Part 6: Custom Domain (Optional)

### 6.1 Add Custom Domain to Vercel

1. In Vercel project settings → Domains
2. Add your domain (e.g., `squadup.com`)
3. Follow DNS configuration instructions
4. Wait for DNS propagation (can take up to 48 hours)

### 6.2 Add Custom Domain to Render

1. In Render service settings → Custom domain
2. Add your API subdomain (e.g., `api.squadup.com`)
3. Follow DNS configuration instructions

### 6.3 Update Environment Variables

After custom domains are active:
- Update `FRONTEND_URL` in Render
- Update `VITE_API_URL` and `VITE_SOCKET_URL` in Vercel
- Update Firebase authorized domains

---

## Part 7: Continuous Deployment

Both Vercel and Render support automatic deployments:

### Auto-Deploy Setup

1. **Main Branch Deployment:**
   - Any push to `main` branch automatically triggers deployment
   
2. **Preview Deployments (Vercel):**
   - Pull requests automatically create preview deployments
   
3. **Manual Deploys:**
   - Trigger manual redeploys from dashboard if needed

---

## Performance Optimization

### Frontend Optimization

1. **Enable Vercel Analytics:**
   - Go to project settings → Analytics
   - Track performance metrics

2. **Image Optimization:**
   - Use Vercel's Image Optimization
   - Serve images in modern formats

### Backend Optimization

1. **Upgrade Render Plan:**
   - Free tier has cold starts
   - Paid tier ($7/month) keeps service always running

2. **Database Indexing:**
   - Ensure MongoDB indexes are created (done automatically via schemas)

3. **Caching:**
   - Consider adding Redis for caching (future enhancement)

---

## Security Checklist

✅ All environment variables are set correctly
✅ Firebase service account key is not exposed in code
✅ MongoDB connection string uses environment variables
✅ CORS is configured to only allow your frontend domain
✅ Firebase authorized domains include only your domains
✅ All secrets are strong and unique for production
✅ Database network access is configured appropriately

---

## Monitoring & Maintenance

### Error Tracking

Consider adding error tracking services:
- [Sentry](https://sentry.io/) for error monitoring
- [LogRocket](https://logrocket.com/) for session replay

### Uptime Monitoring

Free options:
- [UptimeRobot](https://uptimerobot.com/)
- [Pingdom](https://www.pingdom.com/)

### Database Backups

MongoDB Atlas automatically backs up your data, but verify:
1. Go to MongoDB Atlas → Backup
2. Ensure continuous backups are enabled
3. Test restore process periodically

---

## Scaling Considerations

As your app grows:

1. **Database:**
   - Upgrade MongoDB Atlas tier for better performance
   - Add read replicas for scaling reads

2. **Backend:**
   - Upgrade Render instance for more resources
   - Consider horizontal scaling with multiple instances

3. **Frontend:**
   - Vercel automatically handles CDN and scaling
   - Consider Edge Functions for API routes

4. **Real-time:**
   - Socket.IO can handle thousands of connections
   - For massive scale, consider dedicated WebSocket service

---

## Troubleshooting Deployment

### Backend Won't Start

1. Check Render logs for errors
2. Verify all environment variables are set
3. Ensure MongoDB connection string is correct
4. Check if Firebase service account JSON is valid

### Frontend Build Fails

1. Check Vercel build logs
2. Ensure all dependencies are in `package.json`
3. Try building locally: `npm run build`
4. Check for environment variable issues

### CORS Errors in Production

1. Verify `FRONTEND_URL` in Render matches your Vercel URL
2. Ensure no trailing slashes in URLs
3. Check browser console for exact error message

### Socket.IO Not Connecting

1. Ensure `VITE_SOCKET_URL` points to backend URL (no `/api` suffix)
2. Check Render logs for Socket.IO connection attempts
3. Verify CORS settings allow Socket.IO connections

---

## Cost Breakdown

**Free Tier:**
- MongoDB Atlas: Free (M0)
- Render: Free (with limitations)
- Vercel: Free (generous limits)
- Firebase: Free (Spark plan, limits apply)
- **Total: $0/month**

**Recommended Production:**
- MongoDB Atlas: $0-9/month (M2 tier)
- Render: $7/month (Starter tier)
- Vercel: Free (Pro $20/month if needed)
- Firebase: Pay-as-you-go (Blaze plan)
- **Total: ~$7-20/month**

---

## Next Steps

- Set up error monitoring (Sentry)
- Configure uptime monitoring
- Set up CI/CD workflows
- Add security headers
- Implement rate limiting
- Set up analytics

**Congratulations! Your SquadUp app is now live! 🎉**
