import React from 'react';

import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group"
          >
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-primary transition-colors group-hover:text-primary-600">
              শেকড়
            </h1>
            <span className="hidden sm:inline-block text-sm text-text-medium font-sans">
              The Kolkata Chronicle
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-2 sm:space-x-4">
            {/* Home Link */}
            <Link
              to="/"
              className="px-3 py-2 text-body-sm sm:text-body font-medium text-text-dark hover:text-primary transition-colors rounded-lg hover:bg-background-secondary"
            >
              Home
            </Link>

            {/* Write/Create Link - Only for authenticated creators/authors */}
            {isAuthenticated && user?.role !== 'READER' && (
              <Link
                to="/create"
                className="px-3 py-2 text-body-sm sm:text-body font-medium text-text-dark hover:text-primary transition-colors rounded-lg hover:bg-background-secondary"
              >
                Write
              </Link>
            )}

            {/* Authentication Section */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2 sm:space-x-3 ml-2">
                {/* User Profile */}
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-background-secondary transition-colors group"
                >
                  {/* Avatar */}
                  <div className="relative">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name || 'User'}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-border group-hover:border-primary transition-colors"
                      />
                    ) : (
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary-100 border-2 border-border group-hover:border-primary transition-colors flex items-center justify-center">
                        <span className="text-primary-700 font-semibold text-sm sm:text-base">
                          {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Name - Hidden on mobile */}
                  <span className="hidden sm:inline-block text-body-sm font-medium text-text-dark group-hover:text-primary transition-colors">
                    {user?.name || 'Profile'}
                  </span>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="btn-ghost btn-sm text-text-medium hover:text-primary"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                {/* Login Button */}
                <Link
                  to="/login"
                  className="btn-ghost btn-sm"
                >
                  Login
                </Link>

                {/* Sign Up Button */}
                <Link
                  to="/register"
                  className="btn-primary btn-sm hidden sm:inline-flex"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
