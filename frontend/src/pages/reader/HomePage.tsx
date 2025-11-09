import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/homePage.css';

interface Author {
  name: string;
  avatar: string;
}

interface Story {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  readTime: string;
  views: string;
  author: Author;
  date: string;
  saved?: boolean;
  following?: boolean;
}

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [savedTags, setSavedTags] = useState<string[]>(['Must Read']);
  const [tagInput, setTagInput] = useState('');

  const carouselSlides = [
    {
      image: 'https://images.unsplash.com/photo-1545048702-79362596cdc9?w=1200',
      category: 'Heritage',
      title: 'জোড়াসাঁকো: ঠাকুরবাড়ির ইতিহাস',
      excerpt: 'কলকাতার হৃদয়ে লুকিয়ে থাকা সাংস্কৃতিক ঐতিহ্যের গল্প'
    }
  ];

  // Sample data with actual authors
  const sampleStories: Story[] = [
    {
      id: 1,
      title: 'The Resurrection of Park Street\'s Colonial Architecture',
      excerpt: 'How conservation efforts are bringing new life to Kolkata\'s iconic colonial buildings while preserving their historical essence.',
      category: 'HERITAGE',
      image: 'https://images.unsplash.com/photo-1545048702-79362596cdc9?w=800',
      readTime: '1 min read',
      views: '89',
      author: { name: 'Priya Chatterjee', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Priya' },
      date: 'Oct 14'
    },
    {
      id: 2,
      title: 'আড্ডা in the Digital Age: Can WhatsApp Replace the Chai Shop?',
      excerpt: 'Exploring how Kolkata\'s beloved tradition of casual conversation is adapting to modern technology.',
      category: 'আড্ডা',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
      readTime: '1 min read',
      views: '234',
      author: { name: 'Arnab Sen', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Arnab' },
      date: 'Oct 13'
    }
  ];

  useEffect(() => {
    const fetchStories = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await articlesService.getAll();
        // setStories(response);
        
        // For now, use sample data
        setStories(sampleStories);
      } catch (err) {
        console.error('Error fetching stories:', err);
        setStories(sampleStories);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  // Filter stories by tab
  const getFilteredStories = () => {
    switch(activeTab) {
      case 'following':
        return stories.filter(s => s.following);
      case 'saved':
        return stories.filter(s => s.saved);
      case 'for-you':
        // TODO: Implement recommendation logic
        return stories;
      default:
        return stories;
    }
  };

  const handleFollow = (e: React.MouseEvent, storyId: number) => {
    e.preventDefault();
    e.stopPropagation();
    setStories(stories.map(s => 
      s.id === storyId ? { ...s, following: !s.following } : s
    ));
  };

  const handleSave = (e: React.MouseEvent, story: Story) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedStory(story);
    setSaveModalOpen(true);
    setSavedTags(['Must Read']); // Reset tags
    setTagInput('');
  };

  const completeSave = () => {
    if (selectedStory) {
      setStories(stories.map(s => 
        s.id === selectedStory.id ? { ...s, saved: true } : s
      ));
      console.log('Story saved with tags:', savedTags);
    }
    setSaveModalOpen(false);
    setSelectedStory(null);
  };

  const handleFavorite = (e: React.MouseEvent, storyId: number) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Favorite toggled for story:', storyId);
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !savedTags.includes(trimmedTag)) {
      setSavedTags([...savedTags, trimmedTag]);
    }
  };

  const removeTag = (tag: string) => {
    setSavedTags(savedTags.filter(t => t !== tag));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput);
      setTagInput('');
    }
  };

  const displayedStories = getFilteredStories();

  return (
    <div className="home-page">
      {/* Header */}
      <header className="home-header">
        <div className="home-header__container">
          <Link to="/" className="home-header__logo">
            শেকড় - The Kolkata Chronicle
          </Link>
          <div className="home-header__actions">
            <span className="home-header__language">কলকাতা ক্রনিকেল</span>
            <div className="home-header__user">D</div>
            <span className="home-header__username">D</span>
            <button className="home-header__logout">Logout</button>
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
              <span className="hero-carousel__date">Thursday, October 16, 2025 • 7:30 AM</span>
              <h1 className="hero-carousel__title">মর্নিং ব্রিফ</h1>
              <p className="hero-carousel__text">Everything you need to know about Kolkata today. Your 5-minute companion before the first cup of cha.</p>
              <div className="hero-carousel__actions">
                <button className="hero-carousel__btn hero-carousel__btn--primary">📄 Read Brief (5 min)</button>
                <button className="hero-carousel__btn hero-carousel__btn--secondary">🎧 Listen to Podcast (2 min)</button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Stories Grid */}
      <section className="stories-section">
        {displayedStories.length === 0 ? (
          <div className="empty-state">
            <h3>No stories found</h3>
            <p>
              {activeTab === 'following' && 'Start following authors to see their stories here.'}
              {activeTab === 'saved' && 'Save stories to read them later.'}
            </p>
          </div>
        ) : (
          <div className="stories-section__grid">
            {displayedStories.map((story) => (
              <div key={story.id} className="story-card-wrapper">
                <Link to={`/articles/${story.id}`} className="story-card">
                  <div className="story-card__image-container">
                    <img src={story.image} alt={story.title} className="story-card__image" />
                    <button className="story-card__favorite" onClick={(e) => handleFavorite(e, story.id)}>
                      ❤️
                    </button>
                  </div>
                  <div className="story-card__content">
                    <div className="story-card__author">
                      <img src={story.author.avatar} alt={story.author.name} className="story-card__author-avatar" />
                      <div className="story-card__author-info">
                        <span className="story-card__author-name">{story.author.name}</span>
                        <span className="story-card__date">• {story.date}</span>
                      </div>
                      <button 
                        className={`story-card__follow-btn ${story.following ? 'following' : ''}`}
                        onClick={(e) => handleFollow(e, story.id)}
                      >
                        {story.following ? 'Following' : '+ Follow'}
                      </button>
                    </div>
                    <div className="story-card__category-tag">{story.category}</div>
                    <h3 className="story-card__title">{story.title}</h3>
                    <p className="story-card__excerpt">{story.excerpt}</p>
                    <div className="story-card__footer">
                      <div className="story-card__meta">
                        <span>📖 {story.readTime}</span>
                        <span>💬 {story.views}</span>
                      </div>
                      <button className="story-card__save-btn" onClick={(e) => handleSave(e, story)}>
                        {story.saved ? '✓ Saved' : '🔖 Save'}
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Save Modal */}
      {saveModalOpen && selectedStory && (
        <div className="modal-overlay" onClick={() => setSaveModalOpen(false)}>
          <div className="save-modal" onClick={(e) => e.stopPropagation()}>
            <div className="save-modal__header">
              <h2>Save Story</h2>
              <button onClick={() => setSaveModalOpen(false)}>✕</button>
            </div>
            <h3 className="save-modal__story-title">{selectedStory.title}</h3>
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
