import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const { currentUser, userProfile, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 md:top-6 left-0 md:left-1/2 md:-translate-x-1/2 right-0 md:right-auto md:w-[90%] md:max-w-7xl z-50 md:rounded-2xl glass-nav transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        <Logo />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/"
                            className="text-gray-300 hover:text-white transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            to="/projects"
                            className="text-gray-300 hover:text-white transition-colors"
                        >
                            Projects
                        </Link>
                        <Link
                            to="/experts"
                            className="text-gray-300 hover:text-white transition-colors"
                        >
                            Experts
                        </Link>
                        <Link
                            to="/chat"
                            className="text-gray-300 hover:text-white transition-colors"
                        >
                            Chat
                        </Link>

                        {currentUser ? (
                            <div className="relative">
                                <button
                                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                                >
                                    {userProfile?.photoURL ? (
                                        <img
                                            src={userProfile.photoURL}
                                            alt="Profile"
                                            className="w-8 h-8 rounded-full border-2 border-primary-500"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                                            <User className="w-5 h-5" />
                                        </div>
                                    )}
                                    <span>{userProfile?.displayName}</span>
                                </button>

                                {/* Profile Dropdown */}
                                {profileMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 glass-effect rounded-lg shadow-xl py-2">
                                        <Link
                                            to="/dashboard"
                                            className="flex items-center px-4 py-2 text-gray-300 hover:bg-white/10 transition-colors"
                                            onClick={() => setProfileMenuOpen(false)}
                                        >
                                            <LayoutDashboard className="w-4 h-4 mr-2" />
                                            Dashboard
                                        </Link>

                                        {userProfile?.role === 'admin' && (
                                            <Link
                                                to="/admin"
                                                className="flex items-center px-4 py-2 text-gray-300 hover:bg-white/10 transition-colors"
                                                onClick={() => setProfileMenuOpen(false)}
                                            >
                                                <LayoutDashboard className="w-4 h-4 mr-2" />
                                                Admin Dashboard
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setProfileMenuOpen(false);
                                            }}
                                            className="flex items-center w-full px-4 py-2 text-gray-300 hover:bg-white/10 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4 mr-2" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/login"
                                    className="text-gray-300 hover:text-white transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="px-6 py-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg font-medium hover:shadow-lg hover:shadow-accent-500/50 transition-all"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-gray-300 hover:bg-white/10"
                    >
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="md:hidden glass-effect border-t border-white/10">
                    <div className="px-4 py-4 space-y-4">
                        <Link
                            to="/"
                            className="block text-gray-300 hover:text-white transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            to="/projects"
                            className="block text-gray-300 hover:text-white transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Projects
                        </Link>
                        <Link
                            to="/experts"
                            className="block text-gray-300 hover:text-white transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Experts
                        </Link>
                        <Link
                            to="/chat"
                            className="block text-gray-300 hover:text-white transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Chat
                        </Link>

                        {currentUser ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="block text-gray-300 hover:text-white transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                {userProfile?.role === 'admin' && (
                                    <Link
                                        to="/admin"
                                        className="block text-gray-300 hover:text-white transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Admin Dashboard
                                    </Link>
                                )}
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="block w-full text-left text-gray-300 hover:text-white transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="block text-gray-300 hover:text-white transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="block px-6 py-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg font-medium text-center"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
