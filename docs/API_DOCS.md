# SquadUp - API Documentation

Complete API reference for all endpoints.

**Base URL:** `http://localhost:5000/api` (Development)

**Authentication:** Bearer token in `Authorization` header

```
Authorization: Bearer <firebase-id-token>
```

---

## Authentication

All protected endpoints require a valid Firebase ID token. Get the token after Firebase authentication and include it in requests.

---

## Users API

### Create User
**POST** `/users`

Create a new user after Firebase signup.

**Public** (No authentication required)

**Request Body:**
```json
{
  "uid": "firebase-uid",
  "email": "user@example.com",
  "displayName": "John Doe",
  "role": "user",
  "photoURL": "https://example.com/photo.jpg"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "_id": "...",
    "uid": "firebase-uid",
    "email": "user@example.com",
    "displayName": "John Doe",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get User Profile
**GET** `/users/profile`

Get current authenticated user's profile.

**Protected**

**Response:** `200 OK`

### Update User Profile
**PUT** `/users/profile`

Update user profile.

**Protected**

**Request Body:**
```json
{
  "displayName": "New Name",
  "photoURL": "https://new-photo.jpg"
}
```

---

## Experts API

### Get All Experts
**GET** `/experts`

List all expert profiles.

**Public**

**Response:** `200 OK`
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "...",
      "userId": {
        "displayName": "Expert Name",
        "email": "expert@example.com",
        "photoURL": "..."
      },
      "bio": "Professional bio",
      "expertise": ["React", "Node.js"],
      "hourlyRate": 50,
      "rating": 4.8,
      "totalReviews": 25,
      "totalSessions": 150
    }
  ]
}
```

### Get Expert by ID
**GET** `/experts/:id`

Get single expert profile.

**Public**

### Create Expert Profile
**POST** `/experts`

Create expert profile for authenticated user.

**Protected**

**Request Body:**
```json
{
  "bio": "Full-stack developer with 5 years of experience",
  "expertise": ["React", "Node.js", "MongoDB"],
  "hourlyRate": 50,
  "availability": ["Monday 9-12", "Friday 14-17"],
  "yearsOfExperience": 5,
  "linkedinUrl": "https://linkedin.com/in/...",
  "githubUrl": "https://github.com/..."
}
```

### Update Expert Profile
**PUT** `/experts/:id`

Update expert profile (own profile or admin).

**Protected** (Expert/Admin only)

---

## Bookings API

### Create Booking
**POST** `/bookings`

Create a new session booking.

**Protected**

**Request Body:**
```json
{
  "expertId": "expert-mongodb-id",
  "date": "2024-12-25",
  "timeSlot": "14:00-15:00",
  "topic": "Need help with React hooks"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "_id": "...",
    "userId": {...},
    "expertId": {...},
    "date": "2024-12-25",
    "timeSlot": "14:00-15:00",
    "topic": "Need help with React hooks",
    "status": "pending"
  }
}
```

**Error Responses:**
- `400` - Time slot already booked
- `404` - Expert not found

### Get User Bookings
**GET** `/bookings`

Get current user's bookings.

**Protected**

### Get Expert Bookings
**GET** `/bookings/expert`

Get bookings for current expert.

**Protected** (Expert/Admin only)

### Get All Bookings
**GET** `/bookings/all`

Get all platform bookings.

**Protected** (Admin only)

### Update Booking Status
**PUT** `/bookings/:id`

Update booking details.

**Protected**

**Request Body:**
```json
{
  "status": "confirmed",
  "meetingLink": "https://zoom.us/...",
  "notes": "Session notes"
}
```

---

## Messages API

### Get Chat History
**GET** `/messages/:otherUserId`

Get message history with another user.

**Protected**

**Response:** `200 OK`
```json
{
  "success": true,
  "count": 50,
  "data": [
    {
      "_id": "...",
      "senderId": "uid-1",
      "receiverId": "uid-2",
      "content": "Hello!",
      "timestamp": "2024-01-01T12:00:00.000Z",
      "read": true
    }
  ]
}
```

### Send Message
**POST** `/messages`

Send a message (also available via Socket.IO).

**Protected**

**Request Body:**
```json
{
  "receiverId": "receiver-uid",
  "content": "Hello, I need help with...",
  "messageType": "text"
}
```

### Mark Messages as Read
**PUT** `/messages/read/:otherUserId`

Mark all messages from a user as read.

**Protected**

### Get Unread Count
**GET** `/messages/unread/count`

Get total unread message count.

**Protected**

**Response:**
```json
{
  "success": true,
  "data": {
    "unreadCount": 5
  }
}
```

---

## Admin API

All admin endpoints require `admin` role.

### Get Platform Statistics
**GET** `/admin/stats`

Get overview statistics.

**Protected** (Admin only)

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalUsers": 500,
      "totalExperts": 100,
      "totalBookings": 1000,
      "totalMessages": 5000,
      "recentBookings": 50
    },
    "bookingsByStatus": {
      "pending": 10,
      "confirmed": 20,
      "completed": 60,
      "cancelled": 10
    },
    "usersByRole": {
      "user": 400,
      "expert": 99,
      "admin": 1
    }
  }
}
```

### Get All Users
**GET** `/admin/users`

Get all users with pagination.

**Protected** (Admin only)

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 50)

### Delete User
**DELETE** `/admin/users/:id`

Delete a user and their expert profile.

**Protected** (Admin only)

### Toggle User Status
**PUT** `/admin/users/:id/toggle-status`

Activate/deactivate user account.

**Protected** (Admin only)

### Get All Bookings
**GET** `/admin/bookings`

Get all bookings in the system.

**Protected** (Admin only)

---

## Socket.IO Events

**Connection URL:** `http://localhost:5000`

### Client → Server

#### Join
```javascript
socket.emit('user:join', userId);
```

#### Send Message
```javascript
socket.emit('message:send', {
  senderId: 'uid-1',
  receiverId: 'uid-2',
  content: 'Hello',
  messageType: 'text'
});
```

#### Typing Indicators
```javascript
socket.emit('typing:start', {
  senderId: 'uid-1',
  receiverId: 'uid-2'
});

socket.emit('typing:stop', {
  senderId: 'uid-1',
  receiverId: 'uid-2'
});
```

#### Mark as Read
```javascript
socket.emit('messages:read', {
  senderId: 'uid-2',
  receiverId: 'uid-1'
});
```

### Server → Client

#### Receive Message
```javascript
socket.on('message:receive', (message) => {
  console.log(message);
});
```

#### Message Sent Confirmation
```javascript
socket.on('message:sent', (message) => {
  // Optimistic UI update confirmed
});
```

#### Typing Started
```javascript
socket.on('typing:started', ({ userId }) => {
  // Show typing indicator
});
```

#### Typing Stopped
```javascript
socket.on('typing:stopped', ({ userId }) => {
  // Hide typing indicator
});
```

#### User Online/Offline
```javascript
socket.on('user:online', (userId) => {
  // Update UI
});

socket.on('user:offline', (userId) => {
  // Update UI
});
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

Currently no rate limiting is implemented. For production, consider adding rate limiting middleware.

---

## Examples

### JavaScript/Axios
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Authorization': `Bearer ${firebaseToken}`
  }
});

// Get experts
const { data } = await api.get('/experts');

// Create booking
await api.post('/bookings', {
  expertId: '...',
  date: '2024-12-25',
  timeSlot: '14:00-15:00',
  topic: 'React help'
});
```

### cURL
```bash
# Get experts (public)
curl http://localhost:5000/api/experts

# Create booking (requires auth)
curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{"expertId":"...","date":"2024-12-25","timeSlot":"14:00-15:00","topic":"Help needed"}'
```
