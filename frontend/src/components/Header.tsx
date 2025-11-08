import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
        <Link to="/" className="font-serif text-3xl font-bold text-primary">
          শেকড়
        </Link>

        <nav className="flex items-center gap-8">
          <Link
            to="/"
            className="text-text-dark hover:text-primary transition-colors font-medium"
          >
            Home
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/create"
                className="text-text-dark hover:text-primary transition-colors font-medium"
              >
                Write
              </Link>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                    {user && getInitials(user.name)}
                  </div>
                  <span className="font-semibold text-sm">{user?.name}</span>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="text-text-medium hover:text-text-dark transition-colors text-sm"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-text-dark hover:text-primary transition-colors font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-primary text-white px-6 py-2 rounded-full hover:bg-opacity-90 transition-all font-semibold"
              >
                Subscribe
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
