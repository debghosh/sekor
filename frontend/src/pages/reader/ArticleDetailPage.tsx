import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { articlesService } from '../../services/articlesService';
import { Article } from '../../types/types';
import '../../styles/articleDetail.css';

const ArticleDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchArticle(id);
    }
  }, [id]);

  const fetchArticle = async (articleId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await articlesService.getById(articleId);
      setArticle(response);
    } catch (err) {
      console.error('Error fetching article:', err);
      setError('Failed to load article. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate reading time
  const getReadingTime = (content: string) => {
    const wordsCount = content.split(/\s+/).length;
    return Math.ceil(wordsCount / 200);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container-narrow py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-4 bg-background-secondary rounded w-32"></div>
            <div className="h-12 bg-background-secondary rounded"></div>
            <div className="h-6 bg-background-secondary rounded w-3/4"></div>
            <div className="h-64 bg-background-secondary rounded-lg"></div>
            <div className="space-y-3">
              <div className="h-4 bg-background-secondary rounded"></div>
              <div className="h-4 bg-background-secondary rounded"></div>
              <div className="h-4 bg-background-secondary rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-24 h-24 bg-background-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">😞</span>
          </div>
          <h2 className="text-heading-2 font-serif font-bold text-text-dark mb-2">
            Article Not Found
          </h2>
          <p className="text-body text-text-medium mb-6">
            {error || 'The article you are looking for does not exist.'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const formattedDate = formatDistanceToNow(new Date(article.createdAt), { addSuffix: true });
  const readingTime = getReadingTime(article.content);

  return (
    <div className="min-h-screen bg-background">
      <article className="container-narrow py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link
            to="/home"
            className="inline-flex items-center space-x-2 text-body-sm text-text-medium hover:text-primary transition-colors group"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
            <span>Back to Home</span>
          </Link>
        </nav>

        {/* Category Badge */}
        {article.category && (
          <Link
            to={`/category/${article.category.slug}`}
            className="inline-block mb-4"
          >
            <span className="badge-primary hover:bg-primary-100 transition-colors">
              {article.category.name}
            </span>
          </Link>
        )}

        {/* Title */}
        <h1 className="text-display-3 sm:text-display-2 lg:text-display-1 font-serif font-bold text-text-dark mb-6 leading-tight bengali-text">
          {article.title}
        </h1>

        {/* Summary */}
        {article.summary && (
          <p className="text-body-lg text-text-medium mb-8 leading-relaxed">
            {article.summary}
          </p>
        )}

        {/* Author Info Bar */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-border">
          {/* Author Section */}
          <Link
            to={`/author/${article.authorId}`}
            className="flex items-center space-x-3 group"
          >
            {/* Avatar */}
            {article.author?.avatar ? (
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-700 font-semibold text-lg">
                  {article.author?.name.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
            )}

            {/* Author Details */}
            <div>
              <p className="font-semibold text-text-dark group-hover:text-primary transition-colors">
                {article.author?.name || 'Unknown Author'}
              </p>
              <div className="flex items-center space-x-2 text-body-sm text-text-medium">
                <time dateTime={article.createdAt}>{formattedDate}</time>
                <span>·</span>
                <span>{readingTime} min read</span>
              </div>
            </div>
          </Link>

          {/* Meta Info */}
          <div className="flex items-center space-x-4 text-body-sm text-text-medium">
            <div className="flex items-center space-x-1">
              <span>👁️</span>
              <span>{article.views?.toLocaleString() || 0}</span>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {article.image && (
          <div className="mb-10 -mx-4 sm:mx-0">
            <img
              src={article.image}
              alt={article.title}
              className="w-full rounded-none sm:rounded-xl object-cover max-h-[500px]"
            />
          </div>
        )}

        {/* Article Content */}
        <div 
          className="article-content prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Article Footer */}
        <div className="mt-12 pt-8 border-t border-border">
          {/* Author Card */}
          {article.author && (
            <div className="bg-background-secondary rounded-xl p-6 mb-8">
              <div className="flex items-start space-x-4">
                {/* Avatar */}
                <Link to={`/author/${article.authorId}`}>
                  {article.author.avatar ? (
                    <img
                      src={article.author.avatar}
                      alt={article.author.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-700 font-semibold text-xl">
                        {article.author.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </Link>

                {/* Author Info */}
                <div className="flex-1">
                  <Link to={`/author/${article.authorId}`}>
                    <h3 className="text-heading-4 font-serif font-semibold text-text-dark hover:text-primary transition-colors mb-2">
                      {article.author.name}
                    </h3>
                  </Link>
                  {article.author.bio && (
                    <p className="text-body text-text-medium mb-3">
                      {article.author.bio}
                    </p>
                  )}
                  <Link
                    to={`/author/${article.authorId}`}
                    className="text-body-sm text-primary hover:text-primary-600 font-medium"
                  >
                    View Profile →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Back Link */}
          <div className="text-center">
            <Link
              to="/home"
              className="inline-flex items-center space-x-2 text-body text-text-medium hover:text-primary transition-colors group"
            >
              <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ArticleDetailPage;