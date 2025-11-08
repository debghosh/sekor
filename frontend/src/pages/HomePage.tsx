import React, { useEffect, useState } from 'react';
import { articlesService } from '../services/articlesService';
import { Article } from '../types/types';
import ArticleCard from '../components/ArticleCard';

const HomePage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const response = await articlesService.getAll({ limit: 20 });
      setArticles(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-8 py-20 text-center">
        <div className="animate-pulse">Loading articles...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-8 py-20 text-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-8 py-12">
      <div className="mb-12">
        <h1 className="font-serif text-5xl font-bold text-text-dark mb-4">
          The Kolkata Chronicle
        </h1>
        <p className="text-xl text-text-medium">
          Stories that matter from Bengal and beyond
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-text-medium text-lg">No articles yet. Check back soon!</p>
        </div>
      ) : (
        <div>
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
