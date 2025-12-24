import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CallProvider } from './context/CallContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProjectsPage from './pages/ProjectsPage';
import ExpertsPage from './pages/ExpertsPage';
import AdminDashboard from './pages/AdminDashboard';
import ChatPage from './pages/ChatPage';
import UserDashboard from './pages/UserDashboard';

function App() {
    return (
        <Router>
            <AuthProvider>
                <CallProvider>
                    <div className="App">
                        <Routes>
                            {/* Public routes */}
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />

                            {/* Protected routes */}
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <UserDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/projects"
                                element={
                                    <ProtectedRoute>
                                        <ProjectsPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/experts"
                                element={
                                    <ProtectedRoute>
                                        <ExpertsPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/chat"
                                element={
                                    <ProtectedRoute>
                                        <ChatPage />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Admin only route */}
                            <Route
                                path="/admin"
                                element={
                                    <ProtectedRoute requireRole="admin">
                                        <AdminDashboard />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>

                        {/* Toast notifications */}
                        <Toaster
                            position="top-right"
                            toastOptions={{
                                duration: 3000,
                                style: {
                                    background: '#1f2937',
                                    color: '#fff',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                },
                                success: {
                                    iconTheme: {
                                        primary: '#10b981',
                                        secondary: '#fff',
                                    },
                                },
                                error: {
                                    iconTheme: {
                                        primary: '#ef4444',
                                        secondary: '#fff',
                                    },
                                },
                            }}
                        />
                    </div>
                </CallProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
