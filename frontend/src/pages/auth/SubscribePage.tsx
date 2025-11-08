import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/subscribe.css';

const SubscribePage = () => {
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [selectedFrequency, setSelectedFrequency] = useState('daily');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    interests: ['heritage', 'food', 'culture', 'metro']
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [confirmUrl, setConfirmUrl] = useState('');

  const handleInterestToggle = (interest: string) => {
    if (formData.interests.includes(interest)) {
      setFormData({
        ...formData,
        interests: formData.interests.filter(i => i !== interest)
      });
    } else {
      setFormData({
        ...formData,
        interests: [...formData.interests, interest]
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.interests.length === 0) {
      alert('Please select at least one content preference');
      return;
    }

    // Generate token and save subscription
    const token = 'sub_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    const subscription = {
      token,
      name: formData.name,
      email: formData.email,
      plan: selectedPlan,
      frequency: selectedFrequency,
      interests: formData.interests,
      subscribedAt: new Date().toISOString(),
      confirmed: false
    };

    // Save to localStorage
    const subs = JSON.parse(localStorage.getItem('kcc_pending_subscriptions') || '{}');
    subs[token] = subscription;
    localStorage.setItem('kcc_pending_subscriptions', JSON.stringify(subs));

    // Generate confirmation URL
    const url = `${window.location.origin}/confirm?token=${token}`;
    setConfirmUrl(url);
    setShowSuccess(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (showSuccess) {
    return (
      <div className="subscribe-container">
        <div className="subscribe-card">
          <div style={{ textAlign: 'center', padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ fontSize: '5em', marginBottom: '24px' }}>📧</div>
            <h2 style={{ fontSize: '2em', marginBottom: '16px', color: 'var(--text-dark)', fontFamily: "'Playfair Display', serif" }}>
              Check Your Email!
            </h2>
            <p style={{ color: 'var(--text-medium)', fontSize: '1.1em', lineHeight: '1.6', marginBottom: '24px' }}>
              We've sent a confirmation email to <strong style={{ color: 'var(--primary)' }}>{formData.email}</strong><br />
              Click the link in the email to confirm your subscription and set up your account.
            </p>

            {/* Email Preview */}
            <div style={{ background: '#f8f9fa', border: '2px dashed #e0e0e0', borderRadius: '12px', padding: '30px', marginTop: '32px', textAlign: 'left' }}>
              <h3 style={{ fontSize: '1.2em', marginBottom: '16px', color: 'var(--text-dark)', textAlign: 'center' }}>
                📬 Email Preview (Demo Only)
              </h3>
              <div style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <p style={{ fontSize: '0.9em', color: 'var(--text-medium)', marginBottom: '12px', borderBottom: '1px solid #e0e0e0', paddingBottom: '12px' }}>
                  <strong>From:</strong> Kolkata Chronicle &lt;hello@kolkatachronicle.com&gt;<br />
                  <strong>To:</strong> {formData.email}<br />
                  <strong>Subject:</strong> Confirm your subscription to শেকড়
                </p>
                <div style={{ padding: '20px 0' }}>
                  <h4 style={{ fontSize: '1.3em', marginBottom: '16px', color: 'var(--text-dark)' }}>
                    Welcome to The Kolkata Chronicle!
                  </h4>
                  <p style={{ fontSize: '1em', color: 'var(--text-dark)', marginBottom: '24px', lineHeight: '1.6' }}>
                    Thanks for subscribing! We're excited to have you as part of our community.
                  </p>
                  <p style={{ fontSize: '1em', color: 'var(--text-dark)', marginBottom: '24px', lineHeight: '1.6' }}>
                    Click the button below to confirm your subscription and set up your account:
                  </p>
                  <div style={{ textAlign: 'center', margin: '32px 0' }}>
                    <a 
                      href={confirmUrl}
                      style={{ 
                        display: 'inline-block', 
                        padding: '16px 40px', 
                        background: '#DC143C', 
                        color: 'white', 
                        textDecoration: 'none', 
                        borderRadius: '8px', 
                        fontWeight: 600, 
                        fontSize: '1.1em',
                        boxShadow: '0 4px 12px rgba(220, 20, 60, 0.3)'
                      }}
                    >
                      ✓ Confirm My Subscription
                    </a>
                  </div>
                  <p style={{ fontSize: '0.85em', color: 'var(--text-light)', marginTop: '24px', textAlign: 'center', lineHeight: '1.5' }}>
                    This link is valid for 48 hours. If you didn't subscribe to The Kolkata Chronicle, you can safely ignore this email.
                  </p>
                </div>
              </div>
            </div>
            <p style={{ fontSize: '0.85em', color: 'var(--text-medium)', marginTop: '16px', textAlign: 'center', fontStyle: 'italic' }}>
              ⬆️ In production, this email would be sent to your inbox. For now, click the button above to continue.
            </p>

            <div style={{ marginTop: '40px' }}>
              <Link to="/" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600, fontSize: '1em' }}>
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="subscribe-container">
      <div className="subscribe-card">
        <div className="subscribe-logo">শেকড়</div>
        <div className="subscribe-tagline">The Kolkata Chronicle</div>
        <h1 className="subscribe-title">Choose Your Plan</h1>

        {/* Plans */}
        <div className="plans-grid">
          <div 
            className={`plan-card ${selectedPlan === 'free' ? 'selected' : ''}`}
            onClick={() => setSelectedPlan('free')}
          >
            <div className="plan-name">Free Newsletter</div>
            <div className="plan-price">₹0<span>/month</span></div>
            <ul className="plan-features">
              <li>Weekly newsletter digest</li>
              <li>Access to 3 free articles/month</li>
              <li>Morning brief (text only)</li>
            </ul>
          </div>

          <div 
            className={`plan-card ${selectedPlan === 'premium' ? 'selected' : ''}`}
            onClick={() => setSelectedPlan('premium')}
          >
            <div className="plan-badge">MOST POPULAR</div>
            <div className="plan-name">Premium Access</div>
            <div className="plan-price">₹99<span>/month</span></div>
            <ul className="plan-features">
              <li>Unlimited article access</li>
              <li>Daily personalized newsletter</li>
              <li>Audio briefings & podcasts</li>
              <li>Ad-free reading experience</li>
              <li>Exclusive content & early access</li>
            </ul>
          </div>
        </div>

        {/* Form */}
        <form className="form-section" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="subscriberName">Your Name</label>
            <input
              type="text"
              id="subscriberName"
              className="form-input"
              placeholder="Amit Kumar"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="subscriberEmail">Email Address</label>
            <input
              type="email"
              id="subscriberEmail"
              className="form-input"
              placeholder="amit@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Content Preferences</label>
            <div className="preferences-grid">
              {[
                { value: 'heritage', label: 'Heritage' },
                { value: 'food', label: 'মাছ-ভাত' },
                { value: 'culture', label: 'সংস্কৃতি' },
                { value: 'metro', label: 'Metro News' },
                { value: 'durga-puja', label: 'দুর্গাপূজা' },
                { value: 'adda', label: 'আড্ডা' }
              ].map(interest => (
                <label key={interest.value} className="checkbox-group">
                  <input
                    type="checkbox"
                    name="interests"
                    value={interest.value}
                    checked={formData.interests.includes(interest.value)}
                    onChange={() => handleInterestToggle(interest.value)}
                  />
                  <span>{interest.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Newsletter Frequency</label>
            <div className="frequency-options">
              {['daily', 'weekly', 'monthly'].map(freq => (
                <button
                  key={freq}
                  type="button"
                  className={`frequency-btn ${selectedFrequency === freq ? 'selected' : ''}`}
                  onClick={() => setSelectedFrequency(freq)}
                >
                  {freq.charAt(0).toUpperCase() + freq.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-subscribe">Subscribe Now</button>

          <p className="privacy-note">
            We respect your privacy. You can unsubscribe at any time.<br />
            By subscribing, you agree to our <a href="#">Terms & Privacy Policy</a>.
          </p>
        </form>

        <div className="back-link">
          <Link to="/">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default SubscribePage;
