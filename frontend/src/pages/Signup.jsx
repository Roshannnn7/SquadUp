import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, UserPlus } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const Signup = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        displayName: '',
        role: 'user',
    });
    const [loading, setLoading] = useState(false);
    const { signup, signInWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        if (formData.password.length < 6) {
            return;
        }
        setLoading(true);
        try {
            await signup(formData.email, formData.password, formData.displayName, formData.role);
            navigate('/');
        } catch (error) {
            // Error handled by context
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        setLoading(true);
        try {
            await signInWithGoogle(formData.role);
            navigate('/');
        } catch (error) {
            // Error handled by context
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-12 relative overflow-hidden">
            <div className="absolute inset-0 gradient-bg-animated opacity-20"></div>

            <div className="max-w-md w-full glass-effect rounded-2xl shadow-2xl p-8 border border-white/10 relative z-10">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <UserPlus className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold gradient-text mb-2">Create Account</h2>
                    <p className="text-gray-400">Join SquadUp and start learning</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Full Name
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={formData.displayName}
                                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                placeholder="John Doe"
                                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="your@email.com"
                                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                required
                                minLength={6}
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">At least 6 characters</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            I am a...
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'user' })}
                                className={`px-4 py-3 rounded-lg border ${formData.role === 'user'
                                        ? 'border-primary-500 bg-primary-500/20 text-primary-300'
                                        : 'border-gray-700 bg-gray-800 text-gray-300'
                                    } transition-all`}
                            >
                                Student
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'expert' })}
                                className={`px-4 py-3 rounded-lg border ${formData.role === 'expert'
                                        ? 'border-accent-500 bg-accent-500/20 text-accent-300'
                                        : 'border-gray-700 bg-gray-800 text-gray-300'
                                    } transition-all`}
                            >
                                Expert
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-accent-500/50 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <LoadingSpinner size="small" /> : 'Create Account'}
                    </button>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
                        </div>
                    </div>

                    <button
                        onClick={handleGoogleSignup}
                        disabled={loading}
                        className="mt-4 w-full px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        <span>Sign up with Google</span>
                    </button>
                </div>

                <p className="mt-6 text-center text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
