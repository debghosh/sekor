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
    <header className="border-b border-border bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="group">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary transition-colors group-hover:text-primary-600 bengali-text">
              শেকড়
            </h1>
          </Link>

          {/* Actions */}
          <div className="flex items-center space-x-4 md:space-x-6">
            {isAuthenticated ? (
              <>
                {/* Write Link - Only for authenticated creators/authors */}
                {user?.role !== 'READER' && (
                  <Link
                    to="/create"
                    className="hidden md:inline-block text-text-dark hover:text-primary font-medium transition-colors"
                  >
                    Write
                  </Link>
                )}

                {/* User Avatar/Profile */}
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name || 'User'}
                      className="w-10 h-10 rounded-full object-cover border-2 border-border"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center border-2 border-border">
                      <span className="text-primary-700 font-semibold">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="text-text-medium hover:text-text-dark font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Login Button */}
                <Link
                  to="/login"
                  className="text-text-dark hover:text-primary font-medium transition-colors"
                >
                  Login
                </Link>

                {/* Subscribe Button - Prominent */}
                <Link
                  to="/register"
                  className="bg-primary text-white px-6 py-2.5 rounded-full font-semibold hover:bg-primary-600 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Subscribe
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
