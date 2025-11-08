import React from 'react';

import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { articlesService } from '../../services/articlesService';
import ArticleCard from '../../components/content/ArticleCard';
import NavigationTabs from '../../components/reader/NavigationTabs';

interface Article {
  id: string;
  title: string;
  summary: string;
  image?: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  views: number;
  createdAt: string;
}

const HomePage = () => {
  const { isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'home' | 'forYou' | 'following' | 'saved'>('home');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles();
  }, [activeTab]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Implement different endpoints for different tabs
      // For now, all tabs show the same articles
      const response = await articlesService.getAll();
      setArticles(response.data);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Failed to load articles. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: 'home' | 'forYou' | 'following' | 'saved') => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-white border-b border-border">
        <div className="container-custom py-12 sm:py-16 lg:py-20">
          <div className="max-w-3xl">
            <h1 className="text-display-3 sm:text-display-2 font-serif font-bold text-text-dark mb-4 bengali-text">
              The Kolkata Chronicle
            </h1>
            <p className="text-body-lg text-text-medium">
              Stories that matter from Bengal and beyond
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container-custom py-8">
        {/* Navigation Tabs */}
        <NavigationTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          isAuthenticated={isAuthenticated}
        />

        {/* Articles Grid */}
        <div className="max-w-4xl">
          {/* Loading State */}
          {loading && (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex gap-6">
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-background-secondary rounded w-3/4"></div>
                      <div className="h-6 bg-background-secondary rounded"></div>
                      <div className="h-4 bg-background-secondary rounded"></div>
                      <div className="h-4 bg-background-secondary rounded w-5/6"></div>
                    </div>
                    <div className="w-32 h-32 bg-background-secondary rounded-lg"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-accent-red/10 border border-accent-red/20 rounded-lg p-6 text-center">
              <p className="text-accent-red font-medium mb-2">Error Loading Articles</p>
              <p className="text-text-medium text-body-sm mb-4">{error}</p>
              <button
                onClick={fetchArticles}
                className="btn-primary btn-sm"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && articles.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-background-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📝</span>
              </div>
              <h3 className="text-heading-3 font-serif font-semibold text-text-dark mb-2">
                No Articles Yet
              </h3>
              <p className="text-body text-text-medium mb-6">
                {activeTab === 'home' 
                  ? 'Be the first to share a story!'
                  : activeTab === 'following'
                  ? 'Follow some authors to see their articles here'
                  : activeTab === 'saved'
                  ? 'Save articles to read them later'
                  : 'Your personalized feed will appear here'
                }
              </p>
              {activeTab === 'home' && isAuthenticated && (
                <a href="/create" className="btn-primary">
                  Write an Article
                </a>
              )}
            </div>
          )}

          {/* Articles List */}
          {!loading && !error && articles.length > 0 && (
            <div>
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}

          {/* Load More Button */}
          {!loading && !error && articles.length > 0 && (
            <div className="text-center mt-8">
              <button className="btn-secondary">
                Load More Articles
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
