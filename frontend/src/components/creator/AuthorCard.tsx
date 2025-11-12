import React from 'react';
import { Author } from '../../services/authorsService';
import '../../styles/authorCard.css';

interface AuthorCardProps {
  author: Author;
  onFollowToggle: (authorId: string, isFollowing: boolean) => void;
}

const AuthorCard: React.FC<AuthorCardProps> = ({ author, onFollowToggle }) => {
  const handleFollowClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFollowToggle(author.id, author.isFollowing);
  };

  const getAvatarUrl = () => {
    if (author.avatarUrl) {
      return author.avatarUrl;
    }
    // Generate avatar from initials
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(author.name)}`;
  };

  return (
    <div className="author-card">
      <div className="author-card__avatar-container">
        <img
          src={getAvatarUrl()}
          alt={author.name}
          className="author-card__avatar"
        />
      </div>

      <h3 className="author-card__name">{author.name}</h3>

      {author.bio && (
        <p className="author-card__bio">{author.bio}</p>
      )}

      <div className="author-card__stats">
        <div className="author-card__stat">
          <span className="author-card__stat-value">{author.storiesCount}</span>
          <span className="author-card__stat-label">
            {author.storiesCount === 1 ? 'STORY' : 'STORIES'}
          </span>
        </div>
        <div className="author-card__stat">
          <span className="author-card__stat-value">{author.followersCount}</span>
          <span className="author-card__stat-label">
            {author.followersCount === 1 ? 'FOLLOWER' : 'FOLLOWERS'}
          </span>
        </div>
      </div>

      {author.role && author.role !== 'READER' && (
        <div className="author-card__badge">{author.role}</div>
      )}

      <button
        className={`author-card__follow-btn ${
          author.isFollowing ? 'author-card__follow-btn--following' : ''
        }`}
        onClick={handleFollowClick}
      >
        {author.isFollowing ? 'Unfollow' : 'Follow'}
      </button>
    </div>
  );
};

export default AuthorCard;
