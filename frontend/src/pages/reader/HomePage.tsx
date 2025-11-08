import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Story {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  readTime: string;
  views: string;
}

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [stories, setStories] = useState<Story[]>([]);

  // Hero carousel images - use actual Kolkata images
  const heroImages = [
    'https://images.unsplash.com/photo-1558862107-d49ef2a04d72?w=1920&q=80',
    'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=1920&q=80',
    'https://images.unsplash.com/photo-1610193135128-ad522501e040?w=1920&q=80',
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1920&q=80',
    'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=1920&q=80',
  ];

  // Auto-rotate carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Load featured stories from API
  useEffect(() => {
    // TODO: Replace with actual API call
    // For now, using placeholder data
    setStories([
      {
        id: 1,
        title: 'The Resurrection of Park Street\'s Colonial Architecture',
        excerpt: 'How conservation efforts are bringing new life to Kolkata\'s iconic colonial buildings...',
        category: 'Heritage',
        image: 'https://images.unsplash.com/photo-1610193135128-ad522501e040?w=800&q=80',
        readTime: '8 min',
        views: '2,341'
      },
      {
        id: 2,
        title: 'Inside the Kumartuli Potter\'s Colony: Where Gods Are Born',
        excerpt: 'An intimate look at the artisan community that has been crafting clay idols for generations...',
        category: 'Culture',
        image: 'https://images.unsplash.com/photo-1558862107-d49ef2a04d72?w=800&q=80',
        readTime: '6 min',
        views: '1,823'
      },
      {
        id: 3,
        title: 'মাছ-ভাত: The Soul Food Renaissance',
        excerpt: 'How young chefs are reinventing traditional Bengali fish and rice dishes for a new generation...',
        category: 'Food',
        image: 'https://images.unsplash.com/photo-1596040033229-a0b079c76d42?w=800&q=80',
        readTime: '7 min',
        views: '3,124'
      }
    ]);
  }, []);

  return (
    <div>
      {/* Hero Carousel Section */}
      <section style={{ position: 'relative', height: '85vh', overflow: 'hidden', background: '#000' }}>
        {/* Carousel Slides */}
        {heroImages.map((image, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: index === currentSlide ? 1 : 0,
              transition: 'opacity 1.5s ease-in-out'
            }}
          >
            <img
              src={image}
              alt={`Kolkata ${index + 1}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        ))}

        {/* Hero Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.8) 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          padding: '0 20px',
          zIndex: 1
        }}>
          <h1 style={{
            fontSize: '4rem',
            fontWeight: 800,
            marginBottom: '20px',
            textShadow: '2px 4px 12px rgba(0,0,0,0.5)',
            fontFamily: "'Playfair Display', serif"
          }}>
            শেকড়
          </h1>
          <p style={{
            fontSize: '1.8rem',
            fontWeight: 300,
            marginBottom: '10px',
            textShadow: '1px 2px 8px rgba(0,0,0,0.5)',
            letterSpacing: '1px'
          }}>
            The Kolkata Chronicle
          </p>
          <p style={{
            fontSize: '1.2rem',
            marginBottom: '40px',
            opacity: 0.95,
            textShadow: '1px 2px 6px rgba(0,0,0,0.5)',
            maxWidth: '700px'
          }}>
            Discover authentic stories from the heart of Bengal. Culture, heritage, food, and everything that makes Kolkata extraordinary.
          </p>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link
              to="/subscribe"
              style={{
                background: '#DC143C',
                color: 'white',
                padding: '18px 48px',
                borderRadius: '50px',
                fontSize: '1.2rem',
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow: '0 4px 15px rgba(220, 20, 60, 0.4)',
                transition: 'transform 0.2s',
              }}
            >
              Start Reading - ₹99/month
            </Link>
            <a
              href="#features"
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: 'white',
                padding: '18px 48px',
                borderRadius: '50px',
                fontSize: '1.2rem',
                fontWeight: 600,
                textDecoration: 'none',
                border: '2px solid white',
                backdropFilter: 'blur(10px)',
                transition: 'background 0.2s'
              }}
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '12px',
          zIndex: 2
        }}>
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              style={{
                width: index === currentSlide ? '32px' : '12px',
                height: '12px',
                borderRadius: '6px',
                background: index === currentSlide ? 'white' : 'rgba(255,255,255,0.5)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            />
          ))}
        </div>
      </section>

      {/* Features Section - "Why শেকড়?" */}
      <section id="features" style={{ padding: '80px 20px', background: 'linear-gradient(to bottom, #f8f9fa, white)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1a1a1a', marginBottom: '16px', fontFamily: "'Playfair Display', serif" }}>
              Why শেকড়?
            </h2>
            <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
              Your daily companion for everything happening in and around Kolkata
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '40px'
          }}>
            {[
              { icon: '📰', title: 'Local Stories', desc: 'In-depth coverage of Kolkata\'s culture, heritage, and daily life. Stories you won\'t find anywhere else.' },
              { icon: '🎧', title: 'Audio Briefs', desc: 'Morning briefings you can listen to. Perfect companion with your morning tea.' },
              { icon: '✍️', title: 'Expert Writers', desc: 'Local journalists and writers who know Kolkata inside out. Authentic voices, real stories.' },
              { icon: '🍛', title: 'মাছ-ভাত', desc: 'Food, culture, and everything Bengali. From street food to heritage recipes.' },
              { icon: '🏛️', title: 'Heritage', desc: 'Preserving and celebrating Kolkata\'s rich history and architectural marvels.' },
              { icon: '🚇', title: 'Metro Matters', desc: 'Daily updates on transport, infrastructure, and what matters to commuters.' }
            ].map((feature, i) => (
              <div
                key={i}
                style={{
                  background: 'white',
                  padding: '40px',
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  textAlign: 'center',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                }}
              >
                <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '24px' }}>{feature.icon}</span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '16px' }}>{feature.title}</h3>
                <p style={{ fontSize: '1rem', color: '#666', lineHeight: 1.7 }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Stories Section */}
      <section style={{ padding: '80px 20px', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1a1a1a', marginBottom: '16px', fontFamily: "'Playfair Display', serif" }}>
              Featured Stories
            </h2>
            <p style={{ fontSize: '1.2rem', color: '#666' }}>
              A glimpse of what you'll discover with your subscription
            </p>
          </div>

          {/* Stories Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '30px'
          }}>
            {stories.map((story) => (
              <div
                key={story.id}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.1)';
                }}
              >
                <img src={story.image} alt={story.title} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                <div style={{ padding: '24px' }}>
                  <span style={{
                    display: 'inline-block',
                    background: '#DC143C',
                    color: 'white',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    marginBottom: '12px'
                  }}>
                    {story.category}
                  </span>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '12px', lineHeight: 1.4 }}>
                    {story.title}
                  </h3>
                  <p style={{ fontSize: '0.95rem', color: '#666', lineHeight: 1.6, marginBottom: '16px' }}>
                    {story.excerpt}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.9rem', color: '#999' }}>
                    <span>{story.readTime} read</span>
                    <span>{story.views} views</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '100px 20px',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '20px' }}>
          Join Thousands of Readers
        </h2>
        <p style={{ fontSize: '1.3rem', marginBottom: '40px', opacity: 0.95, maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
          Get unlimited access to all stories, audio briefs, and exclusive content
        </p>
        <p style={{ fontSize: '1.5rem', marginBottom: '30px', fontWeight: 600 }}>
          Just <span style={{ fontSize: '3rem', fontWeight: 800 }}>₹99</span>/month
        </p>
        <Link
          to="/subscribe"
          style={{
            display: 'inline-block',
            background: 'white',
            color: '#667eea',
            padding: '20px 60px',
            borderRadius: '50px',
            fontSize: '1.3rem',
            fontWeight: 600,
            textDecoration: 'none',
            boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s'
          }}
        >
          Subscribe Now
        </Link>
        <p style={{ marginTop: '20px', opacity: 0.8, fontSize: '0.95rem' }}>
          Already a member? <Link to="/login" style={{ color: 'white', textDecoration: 'underline' }}>Sign in</Link>
        </p>
      </section>
    </div>
  );
};

export default HomePage;
