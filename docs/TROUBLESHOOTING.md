# SquadUp - Troubleshooting Guide

Common issues and their solutions.

---

## Backend Issues

### ❌ MongoDB Connection Failed

**Error:** `❌ MongoDB Connection Error: ...`

**Solutions:**

1. **Check IP Whitelist:**
   - Go to MongoDB Atlas → Network Access
   - Ensure `0.0.0.0/0` is whitelisted (or your specific IP)

2. **Verify Connection String:**
   - Ensure password doesn't have special characters
   - If it does, URL-encode them: `p@ssw0rd` → `p%40ssw0rd`
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/squadup`

3. **Check Database User:**
   - Verify user exists in Database Access
   - Ensure user has read/write permissions

4. **Network Issues:**
   - Try pinging MongoDB: `ping cluster0.xxxxx.mongodb.net`
   - Check firewall settings

**Quick Fix:**
```bash
# Test connection with mongosh
mongosh "mongodb+srv://username:password@cluster.mongodb.net/squadup"
```

---

### ❌ Firebase Admin SDK Initialization Failed

**Error:** `❌ Firebase initialization error`

**Solutions:**

1. **Check Service Account Key:**
   - Ensure `FIREBASE_SERVICE_ACCOUNT_KEY` is set
   - Must be valid JSON (entire content from downloaded file)
   - No extra quotes or formatting

2. **Verify JSON Format:**
   ```env
   # Correct (entire JSON on one line):
   FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"..."}

   # Wrong (multi-line or with extra quotes):
   FIREBASE_SERVICE_ACCOUNT_KEY="
   {
     'type': 'service_account'
   }
   "
   ```

3. **Re-download Service Account:**
   - Go to Firebase Console → Project Settings → Service Accounts
   - Generate new private key
   - Replace in `.env`

---

### ❌ Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Windows Solution:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual number)
taskkill /PID 1234 /F
```

**Mac/Linux Solution:**
```bash
# Find and kill process
lsof -ti:5000 | xargs kill -9

# Or change port in .env
PORT=5001
```

---

### ❌ CORS Errors

**Error:** `Access to XMLHttpRequest ... has been blocked by CORS policy`

**Solutions:**

1. **Check Frontend URL:**
   ```env
   # Backend .env
   FRONTEND_URL=http://localhost:5173  # No trailing slash!
   ```

2. **Verify CORS Configuration:**
   - Check `src/server.js` CORS settings
   - Ensure `FRONTEND_URL` matches exactly

3. **Development Mode:**
   ```javascript
   // If using custom domains in development
   const allowedOrigins = [
     process.env.FRONTEND_URL,
     'http://localhost:5173',
     'http://localhost:3000'
   ];
   ```

4. **Browser Cache:**
   - Clear browser cache
   - Try incognito mode

---

## Frontend Issues

### ❌ Firebase Authentication Not Working

**Error:** `Firebase: Error (auth/configuration-not-found)`

**Solutions:**

1. **Check Environment Variables:**
   ```bash
   # Verify all VITE_ variables are set
   echo $VITE_FIREBASE_API_KEY
   ```

2. **Restart Dev Server:**
   ```bash
   # Vite needs restart after .env changes
   npm run dev
   ```

3. **Verify Firebase Config:**
   - Go to Firebase Console → Project Settings
   - Compare values with `.env`
   - Ensure no extra spaces or quotes

4. **Check Auth Providers:**
   - Firebase Console → Authentication → Sign-in method
   - Ensure Email/Password is enabled
   - Ensure Google provider is enabled

---

### ❌ Google Sign-In Fails

**Error:** `Firebase: Error (auth/popup-blocked)`

**Solutions:**

1. **Allow Popups:**
   - Browser may be blocking popups
   - Allow popups from `localhost`

2. **Check Authorized Domains:**
   - Firebase Console → Authentication → Settings → Authorized domains
   - Add `localhost` if not present

3. **OAuth Configuration:**
   - Ensure Google provider is properly configured
   - Add support email in Firebase Console

**Alternative:** Use redirect instead of popup:
```javascript
// In firebase.js
import { signInWithRedirect } from 'firebase/auth';
// Use signInWithRedirect instead of signInWithPopup
```

---

### ❌ API Requests Failing

**Error:** `Error: Network Error` or `401 Unauthorized`

**Solutions:**

1. **Check Backend Running:**
   ```bash
   # Visit backend health check
   curl http://localhost:5000/api/health
   ```

2. **Verify API URL:**
   ```env
   # Frontend .env
   VITE_API_URL=http://localhost:5000/api  # No trailing slash!
   ```

3. **Check Authentication Token:**
   - Open DevTools → Application → Local Storage
   - Verify `authToken` exists
   - Try logging out and back in

4. **CORS Issues:**
   - See CORS section above

5. **Backend Logs:**
   - Check backend terminal for errors
   - Look for authentication middleware errors

---

### ❌ Socket.IO Not Connecting

**Error:** `Socket disconnected` or no real-time updates

**Solutions:**

1. **Check Socket URL:**
   ```env
   # Frontend .env (no /api suffix!)
   VITE_SOCKET_URL=http://localhost:5000
   ```

2. **Verify Backend Running:**
   - Ensure backend server is running
   - Check logs for Socket.IO initialization

3. **Port Conflicts:**
   - Ensure backend port is not blocked
   - Try different port

4. **Transport Issues:**
   ```javascript
   // In socket.js, try forcing WebSocket
   const socket = io(SOCKET_URL, {
     transports: ['websocket'],  // Force WebSocket
   });
   ```

5. **Browser Console:**
   - Check for Socket.IO connection errors
   - Look for CORS or authentication issues

---

## Build Issues

### ❌ Frontend Build Fails

**Error:** `Module not found` or `Cannot find module`

**Solutions:**

1. **Clean Install:**
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check Dependencies:**
   ```bash
   # Ensure all dependencies are in package.json
   npm ls
   ```

3. **Node Version:**
   ```bash
   # Ensure Node.js v18+
   node --version
   ```

4. **Build Locally:**
   ```bash
   # Test build before deployment
   npm run build
   ```

---

### ❌ Backend Build Fails on Render

**Error:** Various build errors

**Solutions:**

1. **Check Node Version:**
   - Add to `package.json`:
   ```json
   "engines": {
     "node": ">=18.0.0"
   }
   ```

2. **Verify Build Command:**
   - Render build command: `npm install`
   - Start command: `npm start`

3. **Check Environment Variables:**
   - Ensure all required variables are set in Render
   - No typos in variable names

4. **Root Directory:**
   - Verify root directory is set to `backend`

---

## Database Issues

### ❌ Data Not Saving

**Error:** `ValidationError` or data not appearing

**Solutions:**

1. **Check Mongoose Schemas:**
   - Verify required fields are provided
   - Check data types match schema

2. **Database Connection:**
   - Ensure MongoDB connection is established
   - Check backend logs for connection status

3. **Validation Errors:**
   ```javascript
   // In backend logs, look for:
   ValidationError: ...
   ```
   - Fix data to match schema requirements

4. **Test with MongoDB Compass:**
   - Connect via MongoDB Compass
   - Manually insert document to verify connection
   - Check collection exists

---

### ❌ Duplicate Key Error

**Error:** `E11000 duplicate key error`

**Solutions:**

1. **Unique Fields:**
   - Email or UID already exists
   - Check for existing user before creating

2. **Clean Database:**
   ```javascript
   // Drop collection and recreate (DEVELOPMENT ONLY!)
   db.users.drop()
   ```

3. **Indexes:**
   - Check MongoDB Atlas → Collections → Indexes
   - Remove duplicate entries manually

---

## Authentication Issues

### ❌ Token Verification Fails

**Error:** `Invalid or expired token`

**Solutions:**

1. **Token Refresh:**
   - Log out and log back in
   - Clear localStorage

2. **Time Sync:**
   - Ensure system clock is synchronized
   - Firebase tokens are time-sensitive

3. **Firebase Project:**
   - Ensure backend and frontend use same Firebase project
   - Verify service account matches project

4. **Token in Headers:**
   ```javascript
   // Check axios interceptor
   config.headers.Authorization = `Bearer ${token}`;
   ```

---

### ❌ Role-Based Access Not Working

**Error:** `Access denied` or can't access admin routes

**Solutions:**

1. **Check User Role:**
   - MongoDB Atlas → Browse Collections → users
   - Verify `role` field is `"admin"`

2. **Token Refresh:**
   - User info is cached in token
   - Log out and log back in

3. **Middleware:**
   - Check `checkRole` middleware
   - Verify role array includes user's role

---

## Production Issues

### ❌ Deployed App Not Loading

**Solutions:**

1. **Check Deployment Status:**
   - Vercel: Check deployment logs
   - Render: Check service status

2. **Environment Variables:**
   - Verify all env vars are set
   - Check for typos

3. **DNS Issues:**
   - Wait for DNS propagation (up to 48 hours)
   - Use Vercel/Render subdomain in meantime

4. **Browser Cache:**
   - Clear browser cache
   - Try incognito mode

---

### ❌ API Calls Fail in Production

**Solutions:**

1. **Check API URL:**
   - Ensure production API URL is correct
   - Use HTTPS, not HTTP

2. **CORS Configuration:**
   - Verify `FRONTEND_URL` in Render matches Vercel URL
   - Include protocol: `https://`

3. **SSL/TLS Issues:**
   - Ensure both frontend and backend use HTTPS
   - Mixed content errors if one is HTTP

4. **Logs:**
   - Check Render logs for errors
   - Check Vercel function logs

---

## Performance Issues

### ❌ Slow API Responses

**Solutions:**

1. **Database Indexes:**
   - Check if indexes are created (should be automatic)
   - MongoDB Atlas → Performance Advisor

2. **Render Free Tier:**
   - Free tier has cold starts
   - Upgrade to paid tier for always-on

3. **Query Optimization:**
   - Use `.lean()` for read-only queries
   - Limit fields with `.select()`

4. **Connection Pooling:**
   - Mongoose handles this automatically
   - Check connection pool size if needed

---

### ❌ Real-time Chat Lag

**Solutions:**

1. **Socket.IO Transport:**
   - Check if WebSocket is being used
   - Polling fallback is slower

2. **Message Batching:**
   - Consider batching messages
   - Throttle typing indicators

3. **Network:**
   - Check network latency
   - Use CDN for static assets

---

## Development Tips

### Enable Debug Logging

**Backend:**
```javascript
// In server.js
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.body);
    next();
  });
}
```

**Frontend:**
```javascript
// In api.js
api.interceptors.request.use((config) => {
  console.log('API Request:', config.url, config.data);
  return config;
});
```

### Clear Everything

```bash
# Frontend
cd frontend
rm -rf node_modules package-lock.json dist
npm install

# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Clear browser
# DevTools → Application → Clear storage → Clear all
```

---

## Getting Help

If you're still stuck:

1. **Check Logs:**
   - Backend terminal output
   - Frontend browser console
   - MongoDB Atlas logs

2. **Enable Debug Mode:**
   - Set `NODE_ENV=development`
   - Check verbose error messages

3. **Search Error Messages:**
   - Copy exact error message
   - Search on Stack Overflow
   - Check GitHub issues

4. **Ask for Help:**
   - Include error message
   - Include relevant code
   - Describe steps to reproduce

---

## Useful Commands

```bash
# Check if ports are in use
Windows: netstat -ano | findstr :5000
Mac/Linux: lsof -i :5000

# Test MongoDB connection
mongosh "your-connection-string"

# Test API endpoint
curl http://localhost:5000/api/health

# Check Node/npm versions
node --version
npm --version

# Rebuild frontend
cd frontend && npm run build

# Restart with fresh install
rm -rf node_modules package-lock.json && npm install
```

---

**Still having issues? Check the logs for specific error messages!**
