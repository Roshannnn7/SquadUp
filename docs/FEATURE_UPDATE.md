# SquadUp Feature Update - Video Calling & Project Filtering

## Overview
This document outlines the major features added to SquadUp:
1. **WebRTC Video Calling** with screen sharing
2. **Project Filtering** to show only user's projects
3. **Enhanced Chat Integration** with video call capabilities

---

## 🎥 Video Calling Features

### Backend Changes

#### 1. Socket Handler (`backend/src/socket/chatHandler.js`)
Added WebRTC signaling events for peer-to-peer video calls:

- **`call:request`** - Initiates a call to another user
- **`call:accepted`** - Accepts an incoming call
- **`call:rejected`** - Rejects an incoming call
- **`call:signaling`** - Exchanges WebRTC signaling data
- **`call:end`** - Ends an active call
- **`call:ended`** - Notifies when a call has ended

**Key Features:**
- Peer-to-peer WebRTC signaling
- Automatic call cleanup on disconnect
- Support for both video and audio calls

### Frontend Changes

#### 1. Dependencies Added
```bash
npm install simple-peer process@0.11.10
```

#### 2. Vite Configuration (`frontend/vite.config.js`)
Added global definitions for WebRTC libraries:
```javascript
define: {
    global: 'window',
    'process.env': {},
}
```

#### 3. New Components

**VideoCall Component** (`frontend/src/components/VideoCall.jsx`)
- Full-featured video calling interface
- **Features:**
  - Video on/off toggle
  - Audio mute/unmute
  - Screen sharing capability
  - Picture-in-picture layout (local + remote video)
  - Beautiful glassmorphic UI
  - Supports both initiator and receiver roles

**IncomingCall Component** (`frontend/src/components/IncomingCall.jsx`)
- Toast-style notification for incoming calls
- Accept/Reject buttons
- Animated pulse effect

**CallContext** (`frontend/src/context/CallContext.jsx`)
- Global state management for calls
- Handles incoming/outgoing call logic
- Integrates with Socket.IO for signaling
- Provides `useCall()` hook for components

#### 4. App Integration (`frontend/src/App.jsx`)
- Wrapped app with `CallProvider`
- Enables global call functionality across all pages

#### 5. ChatWidget Integration (`frontend/src/components/ChatWidget.jsx`)
- Added video call button in chat header
- Integrated with `useCall()` hook
- One-click video calling from chat

---

## 📁 Project Filtering Features

### Backend Changes

#### 1. Project Controller (`backend/src/controllers/projectController.js`)
Enhanced `getAllProjects` to support query parameters:

```javascript
// Filter by owner
GET /api/projects?owner=true

// Filter by membership
GET /api/projects?member=true

// Get all projects (default)
GET /api/projects
```

**Implementation:**
- Checks `owner` and `member` query parameters
- Filters projects based on authenticated user
- Returns only relevant projects

### Frontend Changes

#### 1. API Service (`frontend/src/services/api.js`)
Updated `projectAPI.getAll()` to accept query parameters:
```javascript
getAll: (params) => api.get('/projects', { params })
```

#### 2. ProjectsPage (`frontend/src/pages/ProjectsPage.jsx`)
Added filter functionality:
- **Filter State:** Toggle between "All Projects" and "My Projects"
- **Filter Buttons:** Beautiful gradient UI for switching filters
- **Auto-refresh:** Projects reload when filter changes
- **Loading State:** Shows spinner during filter changes

#### 3. UserDashboard (`frontend/src/pages/UserDashboard.jsx`)
Optimized project fetching:
- Now uses `{ member: 'true' }` parameter
- Removes client-side filtering
- More efficient backend queries

---

## 🚀 How to Use

### Video Calling

1. **Start a Call:**
   - Open chat with any user
   - Click the video camera icon in the chat header
   - Wait for the other user to accept

2. **Receive a Call:**
   - Incoming call notification appears in top-right
   - Click "Accept" to join or "Reject" to decline

3. **During a Call:**
   - **Mute/Unmute:** Click microphone icon
   - **Video On/Off:** Click camera icon
   - **Screen Share:** Click monitor icon to share your screen
   - **End Call:** Click red phone icon

### Project Filtering

1. **View All Projects:**
   - Navigate to Projects page
   - Click "All Projects" button
   - See all projects in the platform

2. **View Your Projects:**
   - Click "My Projects" button
   - See only projects you've created or joined
   - Useful for tracking your active collaborations

---

## 🔧 Technical Architecture

### WebRTC Flow
```
User A                    Socket.IO Server              User B
  |                              |                         |
  |------ call:request --------->|                         |
  |                              |------ call:incoming --->|
  |                              |                         |
  |                              |<----- call:accepted ----|
  |<----- call:accepted ---------|                         |
  |                              |                         |
  |<------------- Peer-to-Peer WebRTC Connection -------->|
```

### Project Filtering Flow
```
Frontend                  Backend                    Database
   |                         |                          |
   |-- GET /api/projects --->|                          |
   |    ?member=true         |                          |
   |                         |-- Query with filter ---->|
   |                         |<---- Filtered results ---|
   |<--- User's projects ----|                          |
```

---

## 🎨 UI/UX Improvements

### Video Call Interface
- **Glassmorphic design** with backdrop blur
- **Smooth animations** for controls
- **Responsive layout** adapts to screen size
- **Visual feedback** for muted/video off states
- **Professional controls** with hover effects

### Project Filters
- **Gradient buttons** matching app theme
- **Active state highlighting**
- **Smooth transitions** between filters
- **Loading states** for better UX

---

## 🔐 Security Considerations

1. **Authentication Required:**
   - All video calls require authenticated users
   - Socket.IO validates user sessions

2. **Peer-to-Peer:**
   - Video/audio streams are P2P (not through server)
   - Reduces server load and latency
   - More private communication

3. **Project Access:**
   - Backend validates user membership
   - Only shows projects user has access to

---

## 📝 Future Enhancements

### Potential Improvements:
- [ ] Call history/logs
- [ ] Group video calls (multi-party)
- [ ] Recording capabilities
- [ ] Virtual backgrounds
- [ ] Chat during video calls
- [ ] Project-specific video rooms
- [ ] Calendar integration for scheduled calls
- [ ] Call quality indicators
- [ ] Bandwidth optimization

---

## 🐛 Known Issues & Limitations

1. **Browser Compatibility:**
   - Requires modern browsers with WebRTC support
   - Screen sharing may not work on all browsers

2. **Mobile Support:**
   - Video calls work on mobile but UI may need optimization
   - Screen sharing limited on mobile devices

3. **Network Requirements:**
   - Requires stable internet connection
   - Firewall/NAT may affect P2P connections (STUN/TURN servers recommended for production)

---

## 📚 Dependencies Added

### Frontend
- `simple-peer` - WebRTC wrapper for easier P2P connections
- `process@0.11.10` - Polyfill for Node.js process in browser

### Backend
No new dependencies required (uses existing Socket.IO)

---

## 🧪 Testing Checklist

### Video Calling
- [ ] Initiate call from chat
- [ ] Accept incoming call
- [ ] Reject incoming call
- [ ] Mute/unmute audio
- [ ] Toggle video on/off
- [ ] Share screen
- [ ] End call gracefully
- [ ] Handle disconnections

### Project Filtering
- [ ] View all projects
- [ ] Filter to "My Projects"
- [ ] Create new project (appears in "My Projects")
- [ ] Join project (appears in "My Projects")
- [ ] Dashboard shows only user's projects

---

## 📞 Support

For issues or questions:
1. Check browser console for errors
2. Verify Socket.IO connection
3. Ensure backend is running
4. Check firewall settings for WebRTC

---

**Last Updated:** December 24, 2024
**Version:** 2.0.0
**Author:** SquadUp Development Team
