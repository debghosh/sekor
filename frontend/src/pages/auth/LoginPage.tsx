import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/auth.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('magic');
  const [magicEmail, setMagicEmail] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [demoEmail, setDemoEmail] = useState('demo@example.com');
  const [demoPassword, setDemoPassword] = useState('demo123');
  const [demoRole, setDemoRole] = useState('reader');

  const handleMagicLink = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Magic link sent! Check your email.');
  };

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Logging in...');
    navigate('/home');
  };

  const handleDemoLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = {
      email: demoEmail,
      name: demoEmail.split('@')[0],
      role: demoRole
    };
    
    sessionStorage.setItem('kcc_user', JSON.stringify(user));
    sessionStorage.setItem('kcc_role', demoRole);
    
    if (demoRole === 'reader') {
      navigate('/reader/home');
    } else if (demoRole === 'author') {
      navigate('/creator/dashboard');
    } else {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">শেকড়</div>
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Sign in to your account</p>

        {/* Auth Method Tabs */}
        <div className="auth-tabs">
          <button 
            className={`auth-tab ${activeTab === 'magic' ? 'active' : ''}`}
            onClick={() => setActiveTab('magic')}
          >
            ✨ Magic Link
          </button>
          <button 
            className={`auth-tab ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            🔐 Password
          </button>
          <button 
            className={`auth-tab ${activeTab === 'demo' ? 'active' : ''}`}
            onClick={() => setActiveTab('demo')}
          >
            🧪 Demo
          </button>
        </div>

        {/* Magic Link Method */}
        {activeTab === 'magic' && (
          <div className="auth-method active">
            <div className="info-box">
              🔒 We'll send a secure one-time link to your email. No password needed!
            </div>

            <form onSubmit={handleMagicLink}>
              <div className="form-group">
                <label className="form-label" htmlFor="magicEmail">Email Address</label>
                <input
                  type="email"
                  id="magicEmail"
                  className="form-input"
                  placeholder="your@email.com"
                  value={magicEmail}
                  onChange={(e) => setMagicEmail(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-primary">
                Send Magic Link
              </button>
            </form>
          </div>
        )}

        {/* Password Method */}
        {activeTab === 'password' && (
          <div className="auth-method active">
            <div className="info-box">
              🔐 Sign in with your email and password
            </div>

            <form onSubmit={handlePasswordLogin}>
              <div className="form-group">
                <label className="form-label" htmlFor="loginEmail">Email Address</label>
                <input
                  type="email"
                  id="loginEmail"
                  className="form-input"
                  placeholder="your@email.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="loginPassword">Password</label>
                <input
                  type="password"
                  id="loginPassword"
                  className="form-input"
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
                <div className="forgot-password">
                  <a href="#" onClick={(e) => { e.preventDefault(); alert('Password reset coming soon!'); }}>
                    Forgot password?
                  </a>
                </div>
              </div>

              <button type="submit" className="btn-primary">
                Sign In
              </button>
            </form>
          </div>
        )}

        {/* Demo Login Method */}
        {activeTab === 'demo' && (
          <div className="auth-method active">
            <div className="demo-note">
              <strong>Demo Mode:</strong> Test different user roles without creating an account.
            </div>

            <div className="demo-accounts">
              <h4>📝 Quick Test Accounts:</h4>
              <ul>
                <li><strong>Reader:</strong> demo@example.com (any password)</li>
                <li><strong>Author:</strong> author@example.com (any password)</li>
                <li><strong>Admin:</strong> admin@example.com (any password)</li>
              </ul>
            </div>

            <form onSubmit={handleDemoLogin}>
              <div className="form-group">
                <label className="form-label" htmlFor="demoEmail">Email</label>
                <input
                  type="email"
                  id="demoEmail"
                  className="form-input"
                  placeholder="demo@example.com"
                  value={demoEmail}
                  onChange={(e) => setDemoEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="demoPassword">Password</label>
                <input
                  type="password"
                  id="demoPassword"
                  className="form-input"
                  placeholder="any password"
                  value={demoPassword}
                  onChange={(e) => setDemoPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="demoRole">Login As</label>
                <select 
                  id="demoRole" 
                  className="form-input" 
                  value={demoRole}
                  onChange={(e) => setDemoRole(e.target.value)}
                  required
                >
                  <option value="reader">Reader - Browse and read articles</option>
                  <option value="author">Author - Write and manage articles</option>
                  <option value="admin">Admin - Manage platform</option>
                </select>
              </div>

              <button type="submit" className="btn-primary">
                Demo Login
              </button>
            </form>
          </div>
        )}

        {/* Signup Prompt */}
        <div className="signup-prompt">
          <p><strong>Don't have an account?</strong></p>
          <Link to="/subscribe" className="btn-secondary">Subscribe Now</Link>
        </div>

        <div className="back-link">
          <Link to="/">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;