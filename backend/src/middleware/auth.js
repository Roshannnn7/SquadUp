import { verifyFirebaseToken } from '../config/firebase.js';
import User from '../models/User.js';

/**
 * Authentication Middleware
 * Verifies Firebase token and attaches user info to request
 */
export const authenticate = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No token provided. Authorization header required.',
            });
        }

        const token = authHeader.split('Bearer ')[1];

        // Verify Firebase token
        const decodedToken = await verifyFirebaseToken(token);

        // Find user in database
        const user = await User.findOne({ uid: decodedToken.uid });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found. Please sign up first.',
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Account is deactivated. Contact admin.',
            });
        }

        // Attach user info to request
        req.user = {
            uid: user.uid,
            email: user.email,
            role: user.role,
            _id: user._id,
        };

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
        });
    }
};

/**
 * Role-based Authorization Middleware
 * Checks if user has required role
 * @param {Array} roles - Array of allowed roles, e.g., ['admin', 'expert']
 */
export const checkRole = (roles = []) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required',
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required role: ${roles.join(' or ')}`,
            });
        }

        next();
    };
};
