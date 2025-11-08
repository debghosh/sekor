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
        
        const response = await fetch('http://localhost:3001/api/v1/articles?status=published&limit=6', {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }

        const data = await response.json();
        
        // Transform API data to match Story interface
        const transformedStories = data.articles.map((article: any) => ({
          id: article.id,
          title: article.title,
          excerpt: article.excerpt || article.content.substring(0, 150) + '...',
          category: article.category?.name || 'Uncategorized',
          image: article.featuredImage || 'https://images.unsplash.com/photo-1545048702-79362596cdc9?w=800',
          readTime: `${Math.ceil(article.content.split(' ').length / 200)} min read`,
          views: article.viewCount ? `${article.viewCount} views` : 'New'
        }));

        setStories(transformedStories);
        setError(null);
      } catch (err) {
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
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      {/* Top Header Bar - Over Hero */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 101,
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ 
          fontSize: '2.5rem', 
          fontWeight: 800, 
          color: 'white',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          শেকড়
        </div>
        <Link 
          to="/login" 
          style={{
            background: 'white',
            color: '#dc143c',
            padding: '10px 24px',
            borderRadius: '25px',
            textDecoration: 'none',
            fontWeight: 600,
            transition: 'all 0.2s',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}
        >
          Login / Subscribe
        </Link>
      </div>

      {/* Hero Carousel */}
      <section style={{
        position: 'relative',
        height: '600px',
        overflow: 'hidden',
        background: '#000'
      }}>
        {carouselSlides.map((slide, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: currentSlide === index ? 1 : 0,
              transition: 'opacity 0.5s ease-in-out',
              pointerEvents: currentSlide === index ? 'auto' : 'none'
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.6)'
            }} />
            <div style={{
              position: 'relative',
              maxWidth: '1400px',
              margin: '0 auto',
              padding: '0 40px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              color: 'white',
              zIndex: 2
            }}>
              <h1 style={{
                fontSize: '4.5rem',
                fontWeight: 800,
                marginBottom: '20px',
                maxWidth: '900px',
                lineHeight: 1.2,
                textShadow: '2px 2px 8px rgba(0,0,0,0.3)'
              }}>
                {slide.title}
              </h1>
              <p style={{
                fontSize: '1.5rem',
                marginBottom: '30px',
                maxWidth: '700px',
                opacity: 0.95,
                textShadow: '1px 1px 4px rgba(0,0,0,0.3)'
              }}>
                {slide.excerpt}
              </p>
              <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                <Link
                  to="/register"
                  style={{
                    background: '#dc143c',
                    color: 'white',
                    padding: '16px 40px',
                    borderRadius: '30px',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 12px rgba(220, 20, 60, 0.4)'
                  }}
                >
                  Start Reading - ₹99/month
                </Link>
                <a
                  href="#about"
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    padding: '16px 40px',
                    borderRadius: '30px',
                    border: '2px solid white',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backdropFilter: 'blur(10px)',
                    textDecoration: 'none'
                  }}
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Controls */}
        <button
          onClick={prevSlide}
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            fontSize: '1.5rem',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'all 0.2s'
          }}
        >
          ‹
        </button>
        <button
          onClick={nextSlide}
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            fontSize: '1.5rem',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'all 0.2s'
          }}
        >
          ›
        </button>

        {/* Carousel Indicators */}
        <div style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '10px',
          zIndex: 10
        }}>
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              style={{
                width: currentSlide === index ? '40px' : '12px',
                height: '12px',
                borderRadius: '6px',
                border: 'none',
                background: currentSlide === index ? 'white' : 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            />
          ))}
        </div>
      </section>

      {/* Secondary Navigation Bar - Below Hero */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid #e5e5e5',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '16px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1a1a1a' }}>
              শেকড়
            </div>
            <span style={{ fontSize: '1rem', fontWeight: 400, color: '#666' }}>
              The Kolkata Chronicle
            </span>
          </div>
          <nav style={{ display: 'flex', gap: '30px', alignItems: 'center', flexWrap: 'wrap' }}>
            <a href="#stories" style={{ color: '#1a1a1a', textDecoration: 'none', fontWeight: 500, fontSize: '1rem' }}>Stories</a>
            <a href="#about" style={{ color: '#1a1a1a', textDecoration: 'none', fontWeight: 500, fontSize: '1rem' }}>About</a>
            <a href="#subscribe" style={{ color: '#1a1a1a', textDecoration: 'none', fontWeight: 500, fontSize: '1rem' }}>Subscribe</a>
            <Link 
              to="/login" 
              style={{
                background: '#dc143c',
                color: 'white',
                padding: '10px 24px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: 600,
                transition: 'all 0.2s'
              }}
            >
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      {/* Featured Stories */}
      <section id="stories" style={{ maxWidth: '1400px', margin: '80px auto', padding: '0 40px' }}>
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: 800,
          marginBottom: '10px',
          color: '#1a1a1a'
        }}>
          Featured Stories
        </h2>
        <p style={{
          fontSize: '1.2rem',
          color: '#666',
          marginBottom: '50px'
        }}>
          Discover the heart and soul of Kolkata through our curated stories
        </p>

        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{
              display: 'inline-block',
              width: '50px',
              height: '50px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #dc143c',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ marginTop: '20px', color: '#666' }}>Loading stories...</p>
          </div>
        )}

        {error && (
          <div style={{
            background: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '30px',
            color: '#856404'
          }}>
            {error}
          </div>
        )}

        {!loading && stories.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '40px'
          }}>
            {stories.map((story) => (
              <article
                key={story.id}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{
                  height: '240px',
                  backgroundImage: `url(${story.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }} />
                <div style={{ padding: '24px' }}>
                  <div style={{
                    background: '#fff0f0',
                    color: '#dc143c',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    width: 'fit-content',
                    marginBottom: '12px'
                  }}>
                    {story.category}
                  </div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    marginBottom: '12px',
                    color: '#1a1a1a',
                    lineHeight: 1.3
                  }}>
                    {story.title}
                  </h3>
                  <p style={{
                    color: '#666',
                    fontSize: '1rem',
                    marginBottom: '16px',
                    lineHeight: 1.6
                  }}>
                    {story.excerpt}
                  </p>
                  <div style={{
                    display: 'flex',
                    gap: '20px',
                    fontSize: '0.9rem',
                    color: '#999'
                  }}>
                    <span>📖 {story.readTime}</span>
                    <span>👁️ {story.views}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* About Section */}
      <section id="about" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '100px 40px',
        color: 'white'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '3rem',
            fontWeight: 800,
            marginBottom: '30px'
          }}>
            Why শেকড়?
          </h2>
          <p style={{
            fontSize: '1.3rem',
            lineHeight: 1.8,
            marginBottom: '20px',
            opacity: 0.95
          }}>
            শেকড় (Roots) - The Kolkata Chronicle is a digital platform dedicated to preserving and celebrating 
            Bengali cultural heritage. We tell the stories of our city's legacy food vendors, poets, historians, 
            and cultural luminaries.
          </p>
          <p style={{
            fontSize: '1.3rem',
            lineHeight: 1.8,
            opacity: 0.95
          }}>
            Discover authentic stories from the heart of Bengal. Culture, heritage, food, 
            and everything that makes Kolkata extraordinary.
          </p>
        </div>
      </section>

      {/* Subscribe Section */}
      <section id="subscribe" style={{
        maxWidth: '1400px',
        margin: '80px auto',
        padding: '0 40px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px',
          padding: '80px 60px',
          textAlign: 'center',
          color: 'white'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            marginBottom: '20px'
          }}>
            Subscribe to The Chronicle
          </h2>
          <p style={{
            fontSize: '1.3rem',
            marginBottom: '40px',
            opacity: 0.95,
            maxWidth: '600px',
            margin: '0 auto 40px'
          }}>
            Get weekly stories from Kolkata delivered straight to your inbox. Join our community of culture enthusiasts.
          </p>
          <div style={{
            display: 'flex',
            gap: '15px',
            maxWidth: '500px',
            margin: '0 auto',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <input
              type="email"
              placeholder="Enter your email"
              style={{
                flex: 1,
                minWidth: '250px',
                padding: '16px 20px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
            <button style={{
              background: '#dc143c',
              color: 'white',
              padding: '16px 32px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
              Subscribe
            </button>
          </div>
          <p style={{
            marginTop: '20px',
            fontSize: '0.9rem',
            opacity: 0.8
          }}>
            Already a member?{' '}
            <Link to="/login" style={{ color: 'white', textDecoration: 'underline' }}>Sign in</Link>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: '#1a1a1a',
        color: 'white',
        padding: '60px 40px 30px',
        marginTop: '80px'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
          marginBottom: '40px'
        }}>
          <div>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              marginBottom: '15px'
            }}>
              শেকড়
            </h3>
            <p style={{ opacity: 0.8, lineHeight: 1.6 }}>
              Preserving Bengali cultural heritage through storytelling, one article at a time.
            </p>
          </div>
          <div>
            <h4 style={{
              fontSize: '1.1rem',
              fontWeight: 600,
              marginBottom: '15px'
            }}>
              Explore
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '10px' }}>
                <a href="#stories" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>Stories</a>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <a href="#about" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>About</a>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <a href="#subscribe" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>Subscribe</a>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <Link to="/login" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>Sign In</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 style={{
              fontSize: '1.1rem',
              fontWeight: 600,
              marginBottom: '15px'
            }}>
              Categories
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '10px', opacity: 0.8 }}>মাছ-ভাত</li>
              <li style={{ marginBottom: '10px', opacity: 0.8 }}>দুর্গাপূজা</li>
              <li style={{ marginBottom: '10px', opacity: 0.8 }}>Heritage</li>
              <li style={{ marginBottom: '10px', opacity: 0.8 }}>আড্ডা</li>
            </ul>
          </div>
          <div>
            <h4 style={{
              fontSize: '1.1rem',
              fontWeight: 600,
              marginBottom: '15px'
            }}>
              Connect
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '10px', opacity: 0.8 }}>Facebook</li>
              <li style={{ marginBottom: '10px', opacity: 0.8 }}>Instagram</li>
              <li style={{ marginBottom: '10px', opacity: 0.8 }}>Twitter</li>
              <li style={{ marginBottom: '10px', opacity: 0.8 }}>YouTube</li>
            </ul>
          </div>
        </div>
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '30px',
          textAlign: 'center',
          opacity: 0.6
        }}>
          <p>© 2024 শেকড় - The Kolkata Chronicle. All rights reserved.</p>
        </div>
      </footer>

      {/* Add CSS animation for loading spinner */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          header > div {
            padding: 15px 20px !important;
          }
          
          header > div > div:first-child {
            font-size: 1.4rem !important;
          }
          
          nav {
            width: 100%;
            justify-content: center !important;
          }

          section[style*="height: 600px"] {
            height: 400px !important;
          }

          section[style*="height: 600px"] h1 {
            font-size: 2rem !important;
          }

          section[style*="height: 600px"] p {
            font-size: 1rem !important;
          }

          section > div[style*="grid"] {
            grid-template-columns: 1fr !important;
          }

          section[style*="About"] h2 {
            font-size: 2rem !important;
          }

          section[style*="About"] p {
            font-size: 1.1rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;