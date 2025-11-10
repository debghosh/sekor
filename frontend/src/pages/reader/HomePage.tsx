import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { articlesService } from '../../services/articlesService';
import { authorsService, Author } from '../../services/authorsService';
import { followAuthor, unfollowAuthor, getFollowedAuthors } from '../../services/api';
import { Article } from '../../types/types';
import AuthorCard from '../../components/AuthorCard';
import '../../styles/homePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState('home');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [savedTags, setSavedTags] = useState<string[]>(['Must Read']);
  const [tagInput, setTagInput] = useState('');
  const [followedAuthors, setFollowedAuthors] = useState<Set<string>>(new Set());
  const [savedArticles, setSavedArticles] = useState<Set<number>>(new Set());
  const [authors, setAuthors] = useState<Author[]>([]);
  const [authorsLoading, setAuthorsLoading] = useState(false);

  // Hero carousel - TODO: Fetch from API or CMS
  const carouselSlides = [
    {
      image: 'https://images.unsplash.com/photo-1545048702-79362596cdc9?w=1200',
      category: 'Heritage',
      title: 'মর্নিং ব্রিফ',
      excerpt: 'Everything you need to know about Kolkata today. Your 5-minute companion before the first cup of cha.'
    }
  ];

  // Redirect to landing if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchArticles();
      loadSavedState();
      loadFollowedAuthorsFromBackend();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Auto-advance carousel
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Effect to fetch authors when Following tab is activated
  useEffect(() => {
    if (activeTab === 'following' && isAuthenticated) {
      fetchAuthors();
    }
  }, [activeTab, isAuthenticated]);

  const loadFollowedAuthorsFromBackend = async () => {
    try {
      const ids = await getFollowedAuthors();
      setFollowedAuthors(new Set(ids));
    } catch (error) {
      console.error('Failed to load followed authors from backend', error);
    }
  };

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await articlesService.getAll({
        page: 1,
        limit: 20,
      });
      setArticles(response.data);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Failed to load articles. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadSavedState = () => {
    const savedArticleIds = localStorage.getItem('savedArticles');
    
    if (savedArticleIds) {
      setSavedArticles(new Set(JSON.parse(savedArticleIds)));
    }
  };

  const saveState = (key: string, value: Set<number> | Set<string>) => {
    localStorage.setItem(key, JSON.stringify(Array.from(value as any)));
  };

  const fetchAuthors = async () => {
    try {
      setAuthorsLoading(true);
      const response = await authorsService.getFollowing({
        page: 1,
        limit: 20,
      });
      setAuthors(response.data);
    } catch (err) {
      console.error('Error fetching authors:', err);
      setAuthors([]);
    } finally {
      setAuthorsLoading(false);
    }
  };

  const handleAuthorFollowToggle = async (authorId: string, isCurrentlyFollowing: boolean) => {
    try {
      if (isCurrentlyFollowing) {
        await authorsService.unfollow(authorId);
      } else {
        await authorsService.follow(authorId);
      }
      fetchAuthors();
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const getFilteredArticles = () => {
    switch(activeTab) {
      case 'following':
        return articles.filter(a => followedAuthors.has(String(a.authorId)));
      case 'saved':
        return articles.filter(a => savedArticles.has(a.id));
      case 'heritage':
        return articles.filter(a => a.category.slug === 'heritage');
      case 'food':
        return articles.filter(a => a.category.slug === 'food' || a.category.slug === 'maach-bhaat');
      case 'culture':
        return articles.filter(a => a.category.slug === 'culture' || a.category.slug === 'songskriti');
      case 'adda':
        return articles.filter(a => a.category.slug === 'adda');
      case 'metro':
        return articles.filter(a => a.category.slug === 'metro');
      case 'for-you':
        return articles;
      default:
        return articles;
    }
  };

  const handleFollow = async (e: React.MouseEvent, authorId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      if (followedAuthors.has(authorId)) {
        await unfollowAuthor(authorId);
        const newFollowed = new Set(followedAuthors);
        newFollowed.delete(authorId);
        setFollowedAuthors(newFollowed);
      } else {
        await followAuthor(authorId);
        const newFollowed = new Set(followedAuthors);
        newFollowed.add(authorId);
        setFollowedAuthors(newFollowed);
      }
    } catch (error) {
      console.error('Failed to update follow status', error);
    }
  };

  const handleSave = (e: React.MouseEvent, article: Article) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedArticle(article);
    setSaveModalOpen(true);
    setSavedTags(['Must Read']);
    setTagInput('');
  };

  const completeSave = () => {
    if (selectedArticle) {
      const newSaved = new Set(savedArticles);
      newSaved.add(selectedArticle.id);
      setSavedArticles(newSaved);
      saveState('savedArticles', newSaved);
    }
    setSaveModalOpen(false);
    setSelectedArticle(null);
  };

  const handleFavorite = (e: React.MouseEvent, articleId: number) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Favorite article:', articleId);
  };

  const addTag = (tag: string) => {
    if (!savedTags.includes(tag)) {
      setSavedTags([...savedTags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    setSavedTags(savedTags.filter(t => t !== tag));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      addTag(tagInput.trim());
      setTagInput('');
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const displayedArticles = loading ? [] : getFilteredArticles();

  return (
    <div className="home-page">
      {/* Header */}
      <header className="home-header">
        <div className="home-header__container">
          <Link to="/home" className="home-header__logo">
            শেকড় - The Kolkata Chronicle
          </Link>
          <div className="home-header__actions">
            <span className="home-header__language">কলকাতা ক্রনিকেল</span>
            {user && (
              <>
                <div className="home-header__user">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
                <span className="home-header__username">{user.name}</span>
              </>
            )}
            <button className="home-header__logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="home-nav">
        <div className="home-nav__container">
          <button className={`home-nav__tab ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>Home</button>
          <button className={`home-nav__tab ${activeTab === 'for-you' ? 'active' : ''}`} onClick={() => setActiveTab('for-you')}>For You</button>
          <button className={`home-nav__tab ${activeTab === 'following' ? 'active' : ''}`} onClick={() => setActiveTab('following')}>Following</button>
          <button className={`home-nav__tab ${activeTab === 'saved' ? 'active' : ''}`} onClick={() => setActiveTab('saved')}>Saved Stories</button>
          <button className={`home-nav__tab ${activeTab === 'adda' ? 'active' : ''}`} onClick={() => setActiveTab('adda')}>আড্ডা</button>
          <button className={`home-nav__tab ${activeTab === 'culture' ? 'active' : ''}`} onClick={() => setActiveTab('culture')}>সংস্কৃতি</button>
          <button className={`home-nav__tab ${activeTab === 'food' ? 'active' : ''}`} onClick={() => setActiveTab('food')}>মাছ-ভাত</button>
          <button className={`home-nav__tab ${activeTab === 'metro' ? 'active' : ''}`} onClick={() => setActiveTab('metro')}>Metro</button>
          <button className={`home-nav__tab ${activeTab === 'heritage' ? 'active' : ''}`} onClick={() => setActiveTab('heritage')}>Heritage</button>
          <button className={`home-nav__tab ${activeTab === 'audio' ? 'active' : ''}`} onClick={() => setActiveTab('audio')}>🎧 Audio</button>
        </div>
      </nav>

      {/* Hero Carousel - Only show on Home tab */}
      {activeTab === 'home' && (
        <section className="hero-carousel">
          <div className="hero-carousel__slide" style={{ backgroundImage: `url(${carouselSlides[currentSlide].image})` }}>
            <div className="hero-carousel__content">
              <span className="hero-carousel__date">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
              </span>
              <h1 className="hero-carousel__title">{carouselSlides[currentSlide].title}</h1>
              <p className="hero-carousel__text">{carouselSlides[currentSlide].excerpt}</p>
              <div className="hero-carousel__actions">
                <button className="hero-carousel__btn hero-carousel__btn--primary">📄 Read Brief (5 min)</button>
                <button className="hero-carousel__btn hero-carousel__btn--secondary">🎧 Listen to Podcast (2 min)</button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Stories Grid / Authors Grid */}
      <section className="stories-section">
        {activeTab === 'following' ? (
          authorsLoading ? (
            <div className="loading-container">
              <div className="loading-spinner" />
              <p>Loading authors...</p>
            </div>
          ) : authors.length === 0 ? (
            <div className="empty-state">
              <h3>No authors followed</h3>
              <p>Start following authors to see them here.</p>
            </div>
          ) : (
            <div className="authors-section__grid">
              {authors.map((author) => (
                <AuthorCard
                  key={author.id}
                  author={author}
                  onFollowToggle={handleAuthorFollowToggle}
                />
              ))}
            </div>
          )
        ) : (
          displayedArticles.length === 0 ? (
            <div className="empty-state">
              <h3>No articles found</h3>
              <p>
                {activeTab === 'saved' && 'Save articles to read them later.'}
                {activeTab === 'home' && 'No articles available yet.'}
              </p>
            </div>
          ) : (
            <div className="stories-section__grid">
              {displayedArticles.map((article: Article) => (
              <div key={article.id} className="story-card-wrapper">
                <Link to={`/articles/${article.id}`} className="story-card">
                  <div className="story-card__image-container">
                    <img 
                      src={article.image || 'https://images.unsplash.com/photo-1545048702-79362596cdc9?w=800'} 
                      alt={article.title} 
                      className="story-card__image" 
                    />
                    <button className="story-card__favorite" onClick={(e) => handleFavorite(e, article.id)}>
                      ❤️
                    </button>
                  </div>
                  <div className="story-card__content">
                    <div className="story-card__author">
                      <img 
                        src={article.author.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${article.author.name}`} 
                        alt={article.author.name} 
                        className="story-card__author-avatar" 
                      />
                      <div className="story-card__author-info">
                        <span className="story-card__author-name">{article.author.name}</span>
                        <span className="story-card__date">• {formatDate(article.createdAt)}</span>
                      </div>
                      <button 
                        className={`story-card__follow-btn ${followedAuthors.has(String(article.authorId)) ? 'following' : ''}`}
                        onClick={(e) => handleFollow(e, String(article.authorId))}
                      >
                        {followedAuthors.has(String(article.authorId)) ? 'Following' : '+ Follow'}
                      </button>
                    </div>
                    <div className="story-card__category-tag">{article.category.name}</div>
                    <h3 className="story-card__title">{article.title}</h3>
                    <p className="story-card__excerpt">{article.summary || article.content.substring(0, 150) + '...'}</p>
                    <div className="story-card__footer">
                      <div className="story-card__meta">
                        <span>📖 {calculateReadTime(article.content)}</span>
                        <span>💬 {article.views}</span>
                      </div>
                      <button className="story-card__save-btn" onClick={(e) => handleSave(e, article)}>
                        {savedArticles.has(article.id) ? '✓ Saved' : '🔖 Save'}
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
            </div>
          )
        )}
      </section>

      {/* Save Modal */}
      {saveModalOpen && selectedArticle && (
        <div className="modal-overlay" onClick={() => setSaveModalOpen(false)}>
          <div className="save-modal" onClick={(e) => e.stopPropagation()}>
            <div className="save-modal__header">
              <h2>Save Story</h2>
              <button onClick={() => setSaveModalOpen(false)}>✕</button>
            </div>
            <h3 className="save-modal__story-title">{selectedArticle.title}</h3>
            <div className="save-modal__tags">
              <label>Add Tags</label>
              <div className="save-modal__selected-tags">
                {savedTags.map(tag => (
                  <span key={tag} className="tag">
                    {tag} <button onClick={() => removeTag(tag)}>×</button>
                  </span>
                ))}
              </div>
              <input 
                type="text" 
                placeholder="Type a tag and press Enter..." 
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
              />
              <p className="save-modal__hint">Press Enter to add a tag. You can add multiple tags to organize your saved stories.</p>
              <div className="save-modal__suggested">
                <label>Suggested Tags:</label>
                <div className="save-modal__suggested-tags">
                  {['Must Read', 'Later', 'Reference', 'Inspiration', 'Research'].map(tag => (
                    <button key={tag} onClick={() => addTag(tag)}>{tag}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="save-modal__actions">
              <button onClick={() => setSaveModalOpen(false)}>Cancel</button>
              <button className="primary" onClick={completeSave}>Save Story</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;