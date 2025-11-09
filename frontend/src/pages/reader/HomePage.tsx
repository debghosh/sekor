import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/homePage.css';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carousel data
  const carouselSlides = [
    {
      image: 'https://images.unsplash.com/photo-1545048702-79362596cdc9?w=1200',
      category: 'Heritage',
      title: 'জোড়াসাঁকো: ঠাকুরবাড়ির ইতিহাস',
      excerpt: 'কলকাতার হৃদয়ে লুকিয়ে থাকা সাংস্কৃতিক ঐতিহ্যের গল্প'
    },
    {
      image: 'https://images.unsplash.com/photo-1604909052743-94e838986d24?w=1200',
      category: 'Culture',
      title: 'The Art of Bengali Patachitra',
      excerpt: 'Ancient storytelling through scroll paintings preserved across generations'
    },
    {
      image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=1200',
      category: 'Food',
      title: 'মাছ-ভাত: A Culinary Journey',
      excerpt: 'Exploring the timeless Bengali love affair with fish and rice'
    }
  ];

  // Sample fallback data
  const sampleStories: Story[] = [
    {
      id: 1,
      title: 'The Last Sweet Makers of College Street',
      excerpt: 'Meet the families keeping century-old traditions alive in Kolkata\'s iconic book district.',
      category: 'Food',
      image: 'https://images.unsplash.com/photo-1621955964441-c173e01c135b?w=800',
      readTime: '8 min read',
      views: '2.4k views'
    },
    {
      id: 2,
      title: 'দুর্গাপূজা 2024: Pandal Hopping Guide',
      excerpt: 'Your complete guide to the most innovative and traditional pandals this year.',
      category: 'Culture',
      image: 'https://images.unsplash.com/photo-1601485044181-f34f97baef7c?w=800',
      readTime: '12 min read',
      views: '5.1k views'
    },
    {
      id: 3,
      title: 'সুকুমার রায়ের আজব দেশ',
      excerpt: 'Exploring the surreal world of Bengali children\'s literature\'s greatest pioneer.',
      category: 'Literature',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800',
      readTime: '6 min read',
      views: '1.8k views'
    },
    {
      id: 4,
      title: 'Howrah Bridge: Stories from the Steel',
      excerpt: 'The iconic cantilever bridge that connects two cities and countless lives.',
      category: 'Heritage',
      image: 'https://images.unsplash.com/photo-1588516903720-8ceb67f9ef84?w=800',
      readTime: '10 min read',
      views: '3.2k views'
    },
    {
      id: 5,
      title: 'আড্ডা: The Art of Bengali Conversation',
      excerpt: 'Why the quintessential Bengali pastime is more than just idle chat.',
      category: 'Culture',
      image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800',
      readTime: '7 min read',
      views: '4.5k views'
    },
    {
      id: 6,
      title: 'রবীন্দ্র সঙ্গীত in the Digital Age',
      excerpt: 'How Tagore\'s music continues to evolve while staying true to its roots.',
      category: 'Music',
      image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800',
      readTime: '9 min read',
      views: '2.9k views'
    }
  ];

  // Fetch articles from API
  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        
        // Add timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch('http://localhost:3001/api/v1/articles?status=PUBLISHED&limit=6', {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }

        const data = await response.json();

        // Diagnostic logging
        console.log('API Response:', data);
        console.log('data.data exists?', data.data);
        console.log('data.articles exists?', data.articles);
        
        // Transform API data to match Story interface
        const transformedStories = data.data.map((article: any) => ({
          id: article.id,
          title: article.title,
          excerpt: article.summary || article.content.substring(0, 150) + '...',
          category: article.category?.name || 'Uncategorized',
          image: article.image || 'https://images.unsplash.com/photo-1545048702-79362596cdc9?w=800',
          readTime: `${Math.ceil((article.content?.split(' ').length || 0) / 200)} min read`,
          views: article.views ? `${article.views} views` : 'New'
        }));

        setStories(transformedStories);
        setError(null);
      } catch (err) {
        // Diagnostic logging
        console.error('Fetch error details:', {
          error: err,
          message: err instanceof Error ? err.message : 'Unknown error',
          name: err instanceof Error ? err.name : 'Unknown',
          stack: err instanceof Error ? err.stack : undefined
        });
        
        // Silently fall back to sample data
        console.warn('API not available, using sample data');
        setStories(sampleStories);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [carouselSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  return (
    <div className="home-page">
      {/* Top Header Bar - Over Hero */}
      <div className="home-header">
        <div className="home-header__logo">
          শেকড়
        </div>
        <Link to="/login" className="home-header__login-btn">
          Login / Subscribe
        </Link>
      </div>

      {/* Hero Carousel */}
      <section className="hero-carousel">
        {carouselSlides.map((slide, index) => (
          <div
            key={index}
            className={`hero-carousel__slide ${currentSlide === index ? 'hero-carousel__slide--active' : ''}`}
          >
            <div 
              className="hero-carousel__background"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className="hero-carousel__overlay">
              <div className="hero-carousel__content">
                <div className="hero-carousel__category">{slide.category}</div>
                <h1 className="hero-carousel__title">{slide.title}</h1>
                <p className="hero-carousel__excerpt">{slide.excerpt}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Controls */}
        <div className="carousel-controls">
          <button 
            onClick={prevSlide}
            className="carousel-controls__btn"
            aria-label="Previous slide"
          >
            ‹
          </button>
          <div className="carousel-controls__indicators">
            {carouselSlides.map((_, index) => (
              <div
                key={index}
                className={`carousel-controls__dot ${currentSlide === index ? 'carousel-controls__dot--active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
          <button 
            onClick={nextSlide}
            className="carousel-controls__btn"
            aria-label="Next slide"
          >
            ›
          </button>
        </div>
      </section>

      {/* Latest Stories Grid */}
      <section className="stories-section">
        <div className="stories-section__header">
          <h2 className="stories-section__title">Latest from Kolkata</h2>
          <a href="#more" className="stories-section__view-all">
            View All Stories →
          </a>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner" />
          </div>
        ) : (
          <div className="stories-section__grid">
            {stories.map((story) => (
              <Link to={`/article/${story.id}`} key={story.id} className="story-card">
                <div className="story-card__image-container">
                  <img 
                    src={story.image} 
                    alt={story.title}
                    className="story-card__image"
                  />
                  <div className="story-card__category">{story.category}</div>
                </div>
                <div className="story-card__content">
                  <h3 className="story-card__title">{story.title}</h3>
                  <p className="story-card__excerpt">{story.excerpt}</p>
                  <div className="story-card__meta">
                    <span className="story-card__read-time">📖 {story.readTime}</span>
                    <span className="story-card__views">👁 {story.views}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="about-section__content">
          <h2 className="about-section__title">
            Why শেকড়?
          </h2>
          <p className="about-section__text">
            শেকড় (Roots) - The Kolkata Chronicle is a digital platform dedicated to preserving and celebrating 
            Bengali cultural heritage. We tell the stories of our city's legacy food vendors, poets, historians, 
            and cultural luminaries.
          </p>
          <p className="about-section__text">
            Discover authentic stories from the heart of Bengal. Culture, heritage, food, 
            and everything that makes Kolkata extraordinary.
          </p>
        </div>
      </section>

      {/* Subscribe Section */}
      <section id="subscribe" className="subscribe-section">
        <div className="subscribe-section__card">
          <h2 className="subscribe-section__title">
            Subscribe to The Chronicle
          </h2>
          <p className="subscribe-section__description">
            Get weekly stories from Kolkata delivered straight to your inbox. Join our community of culture enthusiasts.
          </p>
          <div className="subscribe-section__form">
            <input
              type="email"
              placeholder="Enter your email"
              className="subscribe-section__input"
            />
            <button className="subscribe-section__button">
              Subscribe
            </button>
          </div>
          <p className="subscribe-section__footer">
            Already a member?{' '}
            <Link to="/login">Sign in</Link>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="home-footer__content">
          <div>
            <h3 className="home-footer__logo">
              শেকড়
            </h3>
            <p className="home-footer__description">
              Preserving Bengali cultural heritage through storytelling, one article at a time.
            </p>
          </div>
          <div>
            <h4 className="home-footer__heading">
              Explore
            </h4>
            <ul className="home-footer__list">
              <li className="home-footer__list-item">
                <a href="#stories" className="home-footer__link">Stories</a>
              </li>
              <li className="home-footer__list-item">
                <a href="#about" className="home-footer__link">About</a>
              </li>
              <li className="home-footer__list-item">
                <a href="#subscribe" className="home-footer__link">Subscribe</a>
              </li>
              <li className="home-footer__list-item">
                <Link to="/login" className="home-footer__link">Sign In</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="home-footer__heading">
              Categories
            </h4>
            <ul className="home-footer__list">
              <li className="home-footer__list-item">মাছ-ভাত</li>
              <li className="home-footer__list-item">দুর্গাপূজা</li>
              <li className="home-footer__list-item">Heritage</li>
              <li className="home-footer__list-item">আড্ডা</li>
            </ul>
          </div>
          <div>
            <h4 className="home-footer__heading">
              Connect
            </h4>
            <ul className="home-footer__list">
              <li className="home-footer__list-item">Facebook</li>
              <li className="home-footer__list-item">Instagram</li>
              <li className="home-footer__list-item">Twitter</li>
              <li className="home-footer__list-item">YouTube</li>
            </ul>
          </div>
        </div>
        <div className="home-footer__bottom">
          <p>© 2024 শেকড় - The Kolkata Chronicle. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
