import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/static-pages.css';

const AboutPage = () => {
  return (
    <div className="static-page">
      <nav className="static-nav">
        <Link to="/" className="static-nav__logo">শেকড়</Link>
        <Link to="/" className="static-nav__back">← Back to Home</Link>
      </nav>

      <div className="static-content">
        <h1>About শেকড় - The Kolkata Chronicle</h1>
        
        <section className="static-section">
          <h2>Our Mission</h2>
          <p>
            শেকড় (Shekod - meaning "roots") is a living archive of Bengali cultural memory. 
            We are dedicated to preserving and sharing the rich tapestry of Kolkata's heritage, 
            stories, and traditions through hyperlocal journalism and authentic storytelling.
          </p>
        </section>

        <section className="static-section">
          <h2>What We Do</h2>
          <p>
            We document the soul of Kolkata - from century-old sweet shops and street food vendors 
            to architectural marvels, cultural luminaries, and the everyday stories that make 
            this city extraordinary. Our platform connects local Kolkatans with the global 
            Bengali diaspora, ensuring that no story is ever forgotten.
          </p>
        </section>

        <section className="static-section">
          <h2>Our Content</h2>
          <ul className="static-list">
            <li><strong>Heritage & Architecture:</strong> Deep dives into Kolkata's historical landmarks and cultural treasures</li>
            <li><strong>Food & Culinary Culture:</strong> Stories from legacy eateries and the culinary traditions of Bengal</li>
            <li><strong>Arts & Literature:</strong> Coverage of theater, music, literature, and the Bengali tradition of adda</li>
            <li><strong>Community Stories:</strong> Personal narratives and profiles of the people who make Kolkata unique</li>
          </ul>
        </section>

        <section className="static-section">
          <h2>Join Our Community</h2>
          <p>
            Whether you're a lifelong Kolkatan or part of the global Bengali diaspora, 
            শেকড় is your connection to the culture, stories, and memories that define us. 
            Join thousands of readers who are preserving Bengali culture, one story at a time.
          </p>
          <Link to="/register" className="static-cta">Start Reading Free</Link>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;