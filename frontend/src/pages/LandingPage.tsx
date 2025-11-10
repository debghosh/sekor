import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import '../styles/landing.css';

const LandingPage = () => {
  const { isAuthenticated } = useAuthStore();

  // If authenticated, show personalized message
  if (isAuthenticated) {
    return (
      <div className="landing-page">
        <nav className="landing-nav">
          <div className="landing-nav__container">
            <Link to="/" className="landing-nav__logo">শেকড়</Link>
            <Link to="/home" className="landing-nav__button">Go to Home</Link>
          </div>
        </nav>
        <div className="landing-hero">
          <h1>Welcome back!</h1>
          <Link to="/home" className="landing-cta">Continue Reading</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="landing-nav__container">
          <Link to="/" className="landing-nav__logo">
            শেকড় - The Kolkata Chronicle
          </Link>
          <div className="landing-nav__actions">
            <Link to="/login" className="landing-nav__link">Sign In</Link>
            <Link to="/register" className="landing-nav__button">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero__container">
          <h1 className="landing-hero__title">
            A Living Archive of Bengali Cultural Memory
          </h1>
          <p className="landing-hero__subtitle">
            Hyperlocal journalism and storytelling from Kolkata. 
            Preserving stories that matter, connecting communities across continents.
          </p>
          <div className="landing-hero__actions">
            <Link to="/register" className="landing-hero__cta-primary">
              Start Reading Free
            </Link>
            <Link to="/login" className="landing-hero__cta-secondary">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="landing-features">
        <div className="landing-features__container">
          <div className="landing-feature">
            <div className="landing-feature__icon">🏛️</div>
            <h3 className="landing-feature__title">Heritage Stories</h3>
            <p className="landing-feature__text">
              Deep dives into Kolkata's architectural treasures, 
              cultural landmarks, and forgotten histories.
            </p>
          </div>

          <div className="landing-feature">
            <div className="landing-feature__icon">🍽️</div>
            <h3 className="landing-feature__title">Food & Culture</h3>
            <p className="landing-feature__text">
              From century-old sweet shops to street food vendors, 
              explore the culinary soul of Bengal.
            </p>
          </div>

          <div className="landing-feature">
            <div className="landing-feature__icon">🎭</div>
            <h3 className="landing-feature__title">Arts & Adda</h3>
            <p className="landing-feature__text">
              Theater, music, literature, and the timeless Bengali 
              tradition of intellectual conversation.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-cta">
        <div className="landing-cta__container">
          <h2 className="landing-cta__title">
            Never Let a Story Be Forgotten
          </h2>
          <p className="landing-cta__text">
            Join thousands of readers preserving Bengali culture, one story at a time.
          </p>
          <Link to="/register" className="landing-cta__button">
            Start Reading - It's Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer__container">
          <div className="landing-footer__logo">শেকড়</div>
          <p className="landing-footer__text">
            The Kolkata Chronicle • কলকাতা ক্রনিকেল
          </p>
          <div className="landing-footer__links">
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/subscribe">Subscribe</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
