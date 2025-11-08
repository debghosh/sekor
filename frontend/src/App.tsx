import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Header from './components/common/Header';
import HomePage from './pages/reader/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import SubscribePage from './pages/auth/SubscribePage';
import ArticleDetailPage from './pages/reader/ArticleDetailPage';

function App() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <Routes>
          {/* HomePage has its own custom header */}
          <Route path="/" element={<HomePage />} />
          
          {/* Auth pages don't need header */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/subscribe" element={<SubscribePage />} />
          
          {/* Other pages use the standard Header */}
          <Route path="/articles/:id" element={<><Header /><ArticleDetailPage /></>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;