import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import LandingPage from './pages/public/LandingPage';
import HomePage from './pages/reader/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import SubscribePage from './pages/auth/SubscribePage';
import ArticleDetailPage from './pages/reader/ArticleDetailPage';
import AuthorProfilePage from './pages/creator/AuthorProfilePage';

import AboutPage from './components/public/AboutPage';
import ContactPage from './components/public/ContactPage';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    useAuthStore.getState().initialize();
  }, 
  []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/subscribe" element={<SubscribePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
    
          
          {/* Protected Routes */}
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/articles/:id" 
            element={
              <ProtectedRoute>
                <ArticleDetailPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/author/:id" 
            element={
              <ProtectedRoute>
                <AuthorProfilePage />
              </ProtectedRoute>
            } 
          />
\          
          {/* Catch all - redirect to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
