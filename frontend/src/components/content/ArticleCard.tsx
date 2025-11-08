import React from 'react';

import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

interface ArticleCardProps {
  article: {
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
  };
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  // Calculate reading time (rough estimate: 200 words per minute)
  const wordsCount = article.summary.split(' ').length * 4; // Multiply by 4 to approximate full article
  const readingTime = Math.ceil(wordsCount / 200);

  // Format the date
  const formattedDate = formatDistanceToNow(new Date(article.createdAt), { addSuffix: true });

  return (
    <article className="group border-b border-border pb-6 mb-6 last:border-0">
      <div className="flex gap-6">
        {/* Content Section */}
        <div className="flex-1 min-w-0">
          {/* Author Info */}
          <Link 
            to={`/author/${article.author.id}`}
            className="flex items-center space-x-2 mb-3 w-fit"
          >
            {/* Author Avatar */}
            {article.author.avatar ? (
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-700 font-semibold text-sm">
                  {article.author.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            
            {/* Author Name and Date */}
            <div className="flex items-center space-x-2 text-body-sm">
              <span className="font-medium text-text-dark hover:text-primary transition-colors">
                {article.author.name}
              </span>
              <span className="text-text-light">·</span>
              <time className="text-text-medium" dateTime={article.createdAt}>
                {formattedDate}
              </time>
            </div>
          </Link>

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
            <h2 className="text-heading-3 font-serif font-bold text-text-dark line-clamp-2 group-hover:text-primary transition-colors">
              {article.title}
            </h2>
          </Link>

          {/* Summary */}
          <Link to={`/article/${article.id}`} className="block mb-3">
            <p className="text-body text-text-medium line-clamp-3">
              {article.summary}
            </p>
          </Link>

          {/* Meta Information */}
          <div className="flex items-center space-x-4 text-body-sm text-text-medium">
            {/* Reading Time */}
            <div className="flex items-center space-x-1">
              <span>⏱️</span>
              <span>{readingTime} min read</span>
            </div>

            {/* View Count */}
            <div className="flex items-center space-x-1">
              <span>👁️</span>
              <span>{article.views.toLocaleString()} views</span>
            </div>
          </div>
        </div>

        {/* Image Section - Only show if image exists */}
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
};

export default ArticleCard;
