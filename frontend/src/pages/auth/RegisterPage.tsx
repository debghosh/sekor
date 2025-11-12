import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import '../../styles/auth.css';

interface Plan {
  id: string;
  name: string;
  priceINR: number;
  priceUSD: number;
  description: string;
  popular?: boolean;
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free Reader',
    priceINR: 0,
    priceUSD: 0,
    description: '3 full articles/month + all abstracts'
  },
  {
    id: 'gold',
    name: 'Gold',
    priceINR: 99,
    priceUSD: 4,
    description: 'Unlimited articles + ad-free',
    popular: true
  },
  {
    id: 'platinum',
    name: 'Platinum',
    priceINR: 199,
    priceUSD: 9,
    description: 'Everything + exclusive content & events'
  }
];

const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuthStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [selectedPlan, setSelectedPlan] = useState(
    searchParams.get('plan') || 'gold'
  );
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      await register(formData.email, formData.password, formData.name);
      localStorage.setItem('selectedPlan', selectedPlan);

      if (selectedPlan !== 'free') {
        navigate(`/payment?plan=${selectedPlan}`);
      } else {
        navigate('/home');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card" style={{ maxWidth: '700px' }}>
        <Link to="/" className="login-logo">শেকড়</Link>
        <h1 className="login-title">Create Your Account</h1>
        <p className="login-subtitle">Join thousands preserving Bengali cultural heritage</p>

        {/* Subscription Plan Selection */}
        <div className="plan-selection-register">
          <div className="currency-switch">
            <button
              type="button"
              className={`currency-btn ${currency === 'INR' ? 'active' : ''}`}
              onClick={() => setCurrency('INR')}
            >
              🇮🇳 INR
            </button>
            <button
              type="button"
              className={`currency-btn ${currency === 'USD' ? 'active' : ''}`}
              onClick={() => setCurrency('USD')}
            >
              🇺🇸 USD
            </button>
          </div>

          <div className="plan-grid">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`plan-card-register ${selectedPlan === plan.id ? 'selected' : ''} ${plan.popular ? 'popular' : ''}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && <div className="popular-badge">Most Popular</div>}
                
                <h3 className="plan-name">{plan.name}</h3>
                
                <div className="plan-price-register">
                  {plan.priceINR === 0 ? (
                    <span className="price-free">Free</span>
                  ) : (
                    <>
                      <span className="price-currency">{currency === 'INR' ? '₹' : '$'}</span>
                      <span className="price-amount">
                        {currency === 'INR' ? plan.priceINR : plan.priceUSD}
                      </span>
                      <span className="price-period">/mo</span>
                    </>
                  )}
                </div>
                
                <p className="plan-description">{plan.description}</p>
                
                {plan.id !== 'free' && (
                  <span className="trial-badge-register">7-day free trial</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="auth-form-register">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="আপনার নাম"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="At least 8 characters"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="form-input"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Repeat your password"
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating Account...' : 
             selectedPlan === 'free' ? 'Create Free Account' : 
             'Start Free Trial'}
          </button>

          <p className="auth-note">
            {selectedPlan !== 'free' && 
              'Your 7-day free trial starts now. Cancel anytime before trial ends. '}
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </form>

        <div className="signup-prompt">
          <p>Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign In</Link></p>
        </div>

        <div className="back-link">
          <Link to="/">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
