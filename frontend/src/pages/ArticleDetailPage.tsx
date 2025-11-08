import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { articlesService } from '../services/articlesService';
import { Article } from '../types/types';

const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadArticle(parseInt(id));
    }
  }, [id]);

  const loadArticle = async (articleId: number) => {
    try {
      setLoading(true);
      const data = await articlesService.getById(articleId);
      setArticle(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load article');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes;
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-8 py-20 text-center">
        <div className="animate-pulse">Loading article...</div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-3xl mx-auto px-8 py-20 text-center">
        <div className="text-red-600 mb-4">{error || 'Article not found'}</div>
        <Link to="/" className="text-primary hover:underline">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-8 py-12">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Link to="/" className="text-primary hover:underline text-sm">
          ← Back to articles
        </Link>
      </div>

      {/* Category */}
      <div className="mb-4">
        <span className="inline-block px-3 py-1 bg-gray-100 text-text-dark text-sm font-medium rounded-full">
          {article.category.name}
        </span>
      </div>

      {/* Title */}
      <h1 className="font-serif text-5xl font-bold text-text-dark mb-6 leading-tight">
        {article.title}
      </h1>

      {/* Summary */}
      {article.summary && (
        <p className="text-xl text-text-medium mb-8 leading-relaxed">
          {article.summary}
        </p>
      )}

      {/* Author and Meta */}
      <div className="flex items-center gap-4 pb-8 mb-8 border-b border-gray-200">
        <div className="flex items-center gap-3">
          {article.author.avatar ? (
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-12 h-12 rounded-full"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-lg font-semibold">
              {article.author.name[0]}
            </div>
          )}
          <div>
            <div className="font-semibold text-text-dark">{article.author.name}</div>
            <div className="text-sm text-text-medium">
              {formatDate(article.createdAt)} · {getReadingTime(article.content)} min read · {article.views} views
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {article.image && (
        <div className="mb-10">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-auto rounded-lg"
          />
        </div>
      )}

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        <div className="text-text-dark leading-relaxed whitespace-pre-wrap">
          {article.content}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <Link to="/" className="text-primary hover:underline">
          ← Back to all articles
        </Link>
      </div>
    </article>
  );
};

export default ArticleDetailPage;
