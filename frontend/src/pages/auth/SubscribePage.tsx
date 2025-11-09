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
          <div className="success-container">
            <div className="success-icon">📧</div>
            <h2 className="success-title">
              Check Your Email!
            </h2>
            <p className="success-description">
              We've sent a confirmation email to <strong>{formData.email}</strong><br />
              Click the link in the email to confirm your subscription and set up your account.
            </p>

            {/* Email Preview */}
            <div className="email-preview">
              <h3 className="email-preview__title">
                📬 Email Preview (Demo Only)
              </h3>
              <div className="email-preview__content">
                <p className="email-preview__header">
                  <strong>From:</strong> Kolkata Chronicle &lt;hello@kolkatachronicle.com&gt;<br />
                  <strong>To:</strong> {formData.email}<br />
                  <strong>Subject:</strong> Confirm your subscription to শেকড়
                </p>
                <div className="email-preview__body">
                  <h4 className="email-preview__heading">
                    Welcome to The Kolkata Chronicle!
                  </h4>
                  <p className="email-preview__text">
                    Thanks for subscribing! We're excited to have you as part of our community.
                  </p>
                  <p className="email-preview__text">
                    Click the button below to confirm your subscription and set up your account:
                  </p>
                  <div className="email-preview__button-container">
                    <a 
                      href={confirmUrl}
                      className="email-preview__button"
                    >
                      ✓ Confirm My Subscription
                    </a>
                  </div>
                  <p className="email-preview__footer">
                    This link is valid for 48 hours. If you didn't subscribe to The Kolkata Chronicle, you can safely ignore this email.
                  </p>
                </div>
              </div>
            </div>
            <p className="success-note">
              ⬆️ In production, this email would be sent to your inbox. For now, click the button above to continue.
            </p>

            <div className="success-back-link">
              <Link to="/">← Back to Home</Link>
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
