import { createContext, useContext, useState, useEffect } from 'react';
import {
    auth,
    googleProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
} from '../config/firebase.js';
import { userAPI } from '../services/api.js';
import socketService from '../services/socket.js';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    /**
     * Sync user from Firebase to backend
     */
    const syncUserToBackend = async (firebaseUser, role = 'user') => {
        try {
            const token = await firebaseUser.getIdToken();
            localStorage.setItem('authToken', token);

            // Create or get user from backend
            try {
                const { data } = await userAPI.getProfile();
                setUserProfile(data.data);
            } catch (error) {
                // User doesn't exist in backend, create it
                if (error.response?.status === 404) {
                    const userData = {
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
                        role: role,
                        photoURL: firebaseUser.photoURL || '',
                    };
                    const { data } = await userAPI.createUser(userData);
                    setUserProfile(data.data);
                } else {
                    throw error;
                }
            }

            // Connect to Socket.IO
            socketService.connect(firebaseUser.uid);
        } catch (error) {
            console.error('Error syncing user to backend:', error);
            throw error;
        }
    };

    /**
     * Sign up with email and password
     */
    const signup = async (email, password, displayName, role = 'user') => {
        try {
            const { user } = await createUserWithEmailAndPassword(auth, email, password);

            // Sync to backend
            await syncUserToBackend(user, role);

            toast.success('Account created successfully! Welcome to SquadUp! 🎉');
            return user;
        } catch (error) {
            console.error('Signup error:', error);
            if (error.code === 'auth/email-already-in-use') {
                toast.error('Email already in use');
            } else if (error.code === 'auth/weak-password') {
                toast.error('Password should be at least 6 characters');
            } else {
                toast.error('Failed to create account');
            }
            throw error;
        }
    };

    /**
     * Sign in with email and password
     */
    const login = async (email, password) => {
        try {
            const { user } = await signInWithEmailAndPassword(auth, email, password);
            await syncUserToBackend(user);
            toast.success('Welcome back! 👋');
            return user;
        } catch (error) {
            console.error('Login error:', error);
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                toast.error('Invalid email or password');
            } else if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
                toast.error('Cannot connect to server. Is backend running? 🔌');
            } else {
                toast.error('Failed to sign in: ' + (error.message || 'Unknown error'));
            }
            throw error;
        }
    };

    /**
     * Sign in with Google
     */
    const signInWithGoogle = async (role = 'user') => {
        try {
            const { user } = await signInWithPopup(auth, googleProvider);
            await syncUserToBackend(user, role);
            toast.success('Signed in with Google! 🎉');
            return user;
        } catch (error) {
            console.error('Google sign in error:', error);
            if (error.code === 'auth/popup-closed-by-user') {
                toast.error('Sign in cancelled');
            } else {
                toast.error('Failed to sign in with Google');
            }
            throw error;
        }
    };

    /**
     * Sign out
     */
    const logout = async () => {
        try {
            await firebaseSignOut(auth);
            localStorage.removeItem('authToken');
            socketService.disconnect();
            setCurrentUser(null);
            setUserProfile(null);
            toast.success('Signed out successfully');
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Failed to sign out');
            throw error;
        }
    };

    /**
     * Update user profile
     */
    const updateProfile = async (profileData) => {
        try {
            const { data } = await userAPI.updateProfile(profileData);
            setUserProfile(data.data);
            toast.success('Profile updated successfully');
            return data.data;
        } catch (error) {
            console.error('Update profile error:', error);
            toast.error('Failed to update profile');
            throw error;
        }
    };

    /**
     * Check user role
     */
    const hasRole = (roles) => {
        if (!userProfile) return false;
        if (Array.isArray(roles)) {
            return roles.includes(userProfile.role);
        }
        return userProfile.role === roles;
    };

    // Listen for auth state changes
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            setLoading(true);
            if (user) {
                setCurrentUser(user);
                try {
                    await syncUserToBackend(user);
                } catch (error) {
                    console.error('Error syncing user:', error);
                }
            } else {
                setCurrentUser(null);
                setUserProfile(null);
                socketService.disconnect();
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        userProfile,
        loading,
        signup,
        login,
        signInWithGoogle,
        logout,
        updateProfile,
        hasRole,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
