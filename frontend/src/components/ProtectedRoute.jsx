import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute Component
 * Protects routes based on authentication and role
 */
const ProtectedRoute = ({ children, requireRole = null }) => {
    const { currentUser, userProfile, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
                    <p className="mt-4 text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    // Not authenticated
    if (!currentUser) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check role if required
    if (requireRole && userProfile) {
        const roles = Array.isArray(requireRole) ? requireRole : [requireRole];
        if (!roles.includes(userProfile.role)) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-900">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-red-500 mb-4">Access Denied</h1>
                        <p className="text-gray-400 mb-8">
                            You don't have permission to access this page.
                        </p>
                        <Navigate to="/" replace />
                    </div>
                </div>
            );
        }
    }

    return children;
};

export default ProtectedRoute;
