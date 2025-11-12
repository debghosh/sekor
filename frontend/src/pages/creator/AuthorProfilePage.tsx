import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Article } from '../../types/types';
import '../../styles/authorProfile.css';

interface Author {
  id: number;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  role: string;
  createdAt: string;
}

const AuthorProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [author, setAuthor] = useState<Author | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (id) {
      fetchAuthorData(id);
    }
  }, [id]);

  const fetchAuthorData = async (authorId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch author profile
      const authorResponse = await fetch(`http://localhost:3001/api/v1/authors/${authorId}`);
      if (!authorResponse.ok) throw new Error('Failed to fetch author');
      const authorData = await authorResponse.json();
      
      console.log('Author data received:', authorData);
      setAuthor(authorData.data);

      // Fetch author's articles
      const articlesResponse = await fetch(
        `http://localhost:3001/api/v1/articles?authorId=${authorId}&status=PUBLISHED&limit=20`
      );
      if (!articlesResponse.ok) throw new Error('Failed to fetch articles');
      const articlesData = await articlesResponse.json();
      setArticles(articlesData.data || articlesData.articles || []);

      // Check if following (from localStorage for now)
      const following = JSON.parse(localStorage.getItem('following') || '[]');
      setIsFollowing(following.includes(parseInt(authorId)));
      
    } catch (err) {
      console.error('Error fetching author data:', err);
      setError('Failed to load author profile. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = () => {
    if (!id) return;
    
    const following = JSON.parse(localStorage.getItem('following') || '[]');
    const authorIdNum = parseInt(id);
    
    if (isFollowing) {
      const updated = following.filter((authorId: number) => authorId !== authorIdNum);
      localStorage.setItem('following', JSON.stringify(updated));
      setIsFollowing(false);
    } else {
      following.push(authorIdNum);
      localStorage.setItem('following', JSON.stringify(following));
      setIsFollowing(true);
    }
  };

  const getReadingTime = (content: string) => {
    const wordsCount = content.split(/\s+/).length;
    return Math.ceil(wordsCount / 200);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container-narrow py-12">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 bg-background-secondary rounded-full"></div>
              <div className="flex-1">
                <div className="h-8 bg-background-secondary rounded w-48 mb-2"></div>
                <div className="h-4 bg-background-secondary rounded w-32"></div>
              </div>
            </div>
            <div className="h-20 bg-background-secondary rounded"></div>
            <div className="space-y-4">
              <div className="h-32 bg-background-secondary rounded"></div>
              <div className="h-32 bg-background-secondary rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-24 h-24 bg-background-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">😞</span>
          </div>
          <h2 className="text-heading-2 font-serif font-bold text-text-dark mb-2">
            Author Not Found
          </h2>
          <p className="text-body text-text-medium mb-6">
            {error || 'The author you are looking for does not exist.'}
          </p>
          <button
            onClick={() => navigate('/home')}
            className="btn-primary"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Safe date formatting
  const memberSince = author?.createdAt 
    ? (() => {
        try {
          return formatDistanceToNow(new Date(author.createdAt), { addSuffix: true });
        } catch (e) {
          return 'Recently joined';
        }
      })()
    : 'Recently joined';

  // Safe initial letter extraction
  const getInitial = (name?: string) => {
    return name && name.length > 0 ? name.charAt(0).toUpperCase() : 'A';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="author-profile-page">
        {/* Back Navigation */}
        <nav className="container-narrow pt-8 pb-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-2 text-body-sm text-text-medium hover:text-primary transition-colors group"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
            <span>Back</span>
          </button>
        </nav>

        {/* Author Header */}
        <div className="author-header bg-white border-b border-border">
          <div className="container-narrow py-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {author.avatar ? (
                  <img
                    src={author.avatar}
                    alt={author.name || 'Author'}
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-primary-100"
                  />
                ) : (
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-primary-100 flex items-center justify-center border-4 border-primary-200">
                    <span className="text-primary-700 font-bold text-4xl sm:text-5xl">
                      {getInitial(author.name)}
                    </span>
                  </div>
                )}
              </div>

              {/* Author Info */}
              <div className="flex-1">
                <h1 className="text-display-3 sm:text-display-2 font-serif font-bold text-text-dark mb-2">
                  {author.name || 'Unknown Author'}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-body-sm text-text-medium mb-4">
                  <span className="inline-flex items-center gap-1">
                    <span>✍️</span>
                    <span>{articles.length} {articles.length === 1 ? 'article' : 'articles'}</span>
                  </span>
                  <span>•</span>
                  <span>Member {memberSince}</span>
                  {author.role === 'CREATOR' && (
                    <>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1 text-primary font-semibold">
                        <span>⭐</span>
                        <span>Verified Creator</span>
                      </span>
                    </>
                  )}
                </div>
                {author.bio && (
                  <p className="text-body text-text-medium mb-4 max-w-2xl leading-relaxed">
                    {author.bio}
                  </p>
                )}
                
                {/* Follow Button */}
                <button
                  onClick={handleFollowToggle}
                  className={`btn ${isFollowing ? 'btn-secondary' : 'btn-primary'}`}
                >
                  {isFollowing ? '✓ Following' : '+ Follow'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Articles Section */}
        <div className="container-narrow py-8">
          <div className="mb-6">
            <h2 className="text-heading-2 font-serif font-bold text-text-dark mb-2">
              Articles by {author.name || 'this author'}
            </h2>
            <p className="text-body text-text-medium">
              {articles.length === 0 
                ? 'No published articles yet.' 
                : `${articles.length} published ${articles.length === 1 ? 'article' : 'articles'}`
              }
            </p>
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-12 bg-background-secondary rounded-lg">
              <span className="text-6xl mb-4 block">📝</span>
              <p className="text-body text-text-medium">
                This author hasn't published any articles yet.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {articles.map((article) => {
                const formattedDate = formatDistanceToNow(new Date(article.createdAt), { addSuffix: true });
                const readingTime = getReadingTime(article.content);

                return (
                  <article 
                    key={article.id}
                    className="group border-b border-border pb-6 last:border-0"
                  >
                    <div className="flex gap-6">
                      {/* Content Section */}
                      <div className="flex-1 min-w-0">
                        {/* Category Badge */}
                        {article.category && (
                          <Link
                            to={`/category/${article.category.slug}`}
                            className="inline-block mb-3"
                          >
                            <span className="badge-primary hover:bg-primary-100 transition-colors">
                              {article.category.name}
                            </span>
                          </Link>
                        )}

                        {/* Title */}
                        <Link to={`/article/${article.id}`} className="block mb-2">
                          <h3 className="text-heading-3 font-serif font-bold text-text-dark line-clamp-2 group-hover:text-primary transition-colors">
                            {article.title}
                          </h3>
                        </Link>

                        {/* Summary */}
                        {article.summary && (
                          <Link to={`/article/${article.id}`} className="block mb-3">
                            <p className="text-body text-text-medium line-clamp-3">
                              {article.summary}
                            </p>
                          </Link>
                        )}

                        {/* Meta Information */}
                        <div className="flex items-center space-x-4 text-body-sm text-text-medium">
                          <time dateTime={article.createdAt}>{formattedDate}</time>
                          <span>•</span>
                          <span>{readingTime} min read</span>
                          <span>•</span>
                          <div className="flex items-center space-x-1">
                            <span>👁️</span>
                            <span>{article.views?.toLocaleString() || 0}</span>
                          </div>
                        </div>
                      </div>

                      {/* Image Section */}
                      {article.image && (
                        <Link 
                          to={`/article/${article.id}`}
                          className="flex-shrink-0 hidden sm:block"
                        >
                          <div className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-32 overflow-hidden rounded-lg">
                            <img
                              src={article.image}
                              alt={article.title}
                              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-350"
                            />
                          </div>
                        </Link>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthorProfilePage;