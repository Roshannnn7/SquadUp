# SquadUp 🚀

**A modern mentorship platform connecting students with expert developers through real-time chat and 1-to-1 video sessions.**

Built with React, Node.js, MongoDB, Firebase, and Socket.IO - a complete production-ready full-stack application.

---

## ✨ Features

### For Students
- 🔍 **Browse Projects** - Discover and join collaborative projects
- 👨‍💻 **Find Experts** - Connect with mentors in various tech stacks
- 💬 **Real-time Chat** - Instant messaging with experts
- 📅 **Book Sessions** - Schedule 1-to-1 video guidance sessions
- 🎯 **Learn & Grow** - Get personalized mentorship

### For Experts
- 💼 **Expert Profiles** - Showcase skills, experience, and rates
- 💰 **Monetize Knowledge** - Set hourly rates for consultations
- 📊 **Track Sessions** - View bookings and session history
- ⭐ **Build Reputation** - Receive ratings and reviews

### For Admins
- 📈 **Analytics Dashboard** - Platform statistics and insights
- 👥 **User Management** - Manage users and permissions
- 📋 **Booking Oversight** - View and manage all bookings

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Tailwind CSS** - Styling with custom theme
- **Vite** - Build tool & dev server
- **React Router** - Client-side routing
- **Firebase Auth** - Authentication (Google + Email/Password)
- **Socket.IO Client** - Real-time messaging
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.IO** - Real-time communication
- **Firebase Admin SDK** - Token verification
- **CORS** - Cross-origin resource sharing

### Infrastructure
- **MongoDB Atlas** - Cloud database
- **Firebase** - Authentication & hosting
- **Vercel** - Frontend deployment
- **Render** - Backend deployment

---

## 📁 Project Structure

```
Squadup/
├── backend/                  # Node.js/Express backend
│   ├── src/
│   │   ├── config/          # Database & Firebase config
│   │   ├── models/          # Mongoose schemas
│   │   ├── controllers/     # Business logic
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth & error handling
│   │   ├── socket/          # Socket.IO handlers
│   │   └── server.js        # Entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React context (Auth)
│   │   ├── services/        # API & Socket services
│   │   ├── config/          # Firebase config
│   │   ├── App.jsx          # Main component
│   │   └── main.jsx         # Entry point
│   ├── public/
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env.example
│
└── docs/                     # Documentation
    ├── SETUP.md             # Local setup guide
    ├── DEPLOYMENT.md        # Production deployment
    ├── API_DOCS.md          # API reference
    └── TROUBLESHOOTING.md   # Common issues
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+ 
- MongoDB Atlas account
- Firebase project

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/squadup.git
cd squadup
```

### 2. Backend Setup
```bash
cd backend
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your credentials

npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your Firebase config

npm run dev
```

### 4. Open Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

📖 **For detailed setup instructions, see [SETUP.md](./docs/SETUP.md)**

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [SETUP.md](./docs/SETUP.md) | Complete local development setup |
| [API_DOCS.md](./docs/API_DOCS.md) | API endpoints reference |
| [DEPLOYMENT.md](./docs/DEPLOYMENT.md) | Production deployment guide |
| [TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) | Common issues & fixes |

---

## 🔑 Key Features Implementation

### Authentication
- Firebase Authentication with Google OAuth
- JWT token-based API authentication
- Role-based access control (user/expert/admin)
- Protected routes & middleware

### Real-time Chat
- Socket.IO bidirectional communication
- Message persistence in MongoDB
- Typing indicators
- Online/offline status
- Read receipts

### Booking System
- Date & time slot selection
- Conflict detection
- Status tracking (pending/confirmed/completed/cancelled)
- Meeting link integration

### Admin Dashboard
- Platform statistics aggregation
- User management (activate/deactivate)
- Booking oversight
- Role distribution analytics

---

## 🎨 Design Features

- **Dark Theme** - Futuristic dark UI
- **Gradient Effects** - Vibrant color gradients
- **Glass Morphism** - Backdrop blur effects
- **Smooth Animations** - CSS animations & transitions
- **Responsive Design** - Mobile-first approach
- **Custom Scrollbars** - Styled scrollbars
- **Loading States** - Skeleton screens & spinners
- **Toast Notifications** - User feedback

---

## 📡 API Endpoints

### Users
```
POST   /api/users              # Create user
GET    /api/users/profile      # Get profile
PUT    /api/users/profile      # Update profile
```

### Experts
```
GET    /api/experts            # List all experts
GET    /api/experts/:id        # Get expert by ID
POST   /api/experts            # Create expert profile
PUT    /api/experts/:id        # Update expert profile
```

### Bookings
```
POST   /api/bookings           # Create booking
GET    /api/bookings           # Get user bookings
GET    /api/bookings/expert    # Get expert bookings
PUT    /api/bookings/:id       # Update booking
```

### Messages
```
GET    /api/messages/:userId   # Get chat history
POST   /api/messages           # Send message
PUT    /api/messages/read/:id  # Mark as read
```

### Admin
```
GET    /api/admin/stats        # Platform stats
GET    /api/admin/users        # All users
DELETE /api/admin/users/:id    # Delete user
```

**Full API documentation: [API_DOCS.md](./docs/API_DOCS.md)**

---

## 🌐 Deployment

### Frontend (Vercel)
```bash
vercel --prod
```

### Backend (Render)
- Connected to GitHub
- Auto-deploys on push to main
- Environment variables configured

**Complete deployment guide: [DEPLOYMENT.md](./docs/DEPLOYMENT.md)**

---

## 🧪 Testing

### Test User Accounts

After setup, create test accounts:

1. **Student Account**
   - Role: user
   - Access: Browse projects, chat, book sessions

2. **Expert Account**
   - Role: expert
   - Access: Manage profile, view bookings

3. **Admin Account**
   - Role: admin
   - Access: Full platform management

---

## 🐛 Troubleshooting

Common issues and solutions:

| Issue | Solution |
|-------|----------|
| MongoDB connection fails | Check IP whitelist in Atlas |
| Firebase auth error | Verify `.env` variables |
| CORS errors | Check `FRONTEND_URL` in backend |
| Port already in use | Kill process or change port |

**See [TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) for detailed solutions**

---

## 📈 Future Enhancements

- [ ] Video calling integration (WebRTC/Twilio)
- [ ] Payment integration (Stripe)
- [ ] Advanced search & filters
- [ ] Expert reviews & ratings
- [ ] Email notifications
- [ ] Calendar integration
- [ ] File sharing in chat
- [ ] Mobile apps (React Native)
- [ ] AI-powered expert matching
- [ ] Analytics dashboard for experts

---

## 🤝 Contributing

This is a portfolio/learning project. Feel free to fork and customize!

### Development Workflow

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

Built with ❤️ by [Your Name]

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourname)

---

## 🙏 Acknowledgments

- [Firebase](https://firebase.google.com/) - Authentication
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Database
- [Vercel](https://vercel.com/) - Frontend hosting
- [Render](https://render.com/) - Backend hosting
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Socket.IO](https://socket.io/) - Real-time features

---

## 📸 Screenshots

### Landing Page
Beautiful hero section with gradient animations

### Expert Directory
Browse and connect with mentors

### Real-time Chat
Instant messaging with typing indicators

### Admin Dashboard
Complete platform analytics

---

## 🎓 Learning Resources

This project demonstrates:
- Full-stack JavaScript development
- Real-time WebSocket connections
- Authentication & authorization
- Database design & indexing
- RESTful API design
- Modern UI/UX patterns
- Cloud deployment
- Environment configuration

---

**⭐ If you found this helpful, please give it a star!**

Made for students, developers, and learners everywhere. 🌍
