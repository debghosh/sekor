import React from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../types/types';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getReadingTime = (content: string) => {
    if (!content) return 1;
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes;
  };

  return (
    <Link to={`/articles/${article.id}`}>
      <article className="border-b border-gray-200 py-10 cursor-pointer hover:bg-gray-50 transition-colors -mx-5 px-5">
        <div className="flex gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              {article.author.avatar ? (
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold">
                  {article.author.name[0]}
                </div>
              )}
              <span className="text-sm font-medium text-text-dark">
                {article.author.name}
              </span>
              <span className="text-text-medium">•</span>
              <span className="text-sm text-text-medium">
                {formatDate(article.createdAt)}
              </span>
            </div>

            <span className="inline-block px-3 py-1 bg-gray-100 text-text-dark text-xs font-medium rounded-full mb-3">
              {article.category.name}
            </span>

            <h2 className="text-2xl font-bold text-text-dark mb-2 line-clamp-2 hover:underline">
              {article.title}
            </h2>

            {article.summary && (
              <p className="text-text-medium text-base mb-4 line-clamp-3">
                {article.summary}
              </p>
            )}

            <div className="flex items-center gap-6 text-sm text-text-medium">
              <span>⏱️ {getReadingTime(article.content)} min read</span>
              <span>👁️ {article.views} views</span>
            </div>
          </div>

          {article.image && (
            <div className="w-48 h-32 flex-shrink-0">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          )}
        </div>
      </article>
    </Link>
  );
};

export default ArticleCard;
