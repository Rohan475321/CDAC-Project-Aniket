import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './PostCard.css';

const PostCard = ({ post, onDelete }) => {
  const { user, isAdmin } = useContext(AuthContext);
  const canEdit = user && (user.id === post.authorId || isAdmin());
  const canDelete = user && (user.id === post.authorId || isAdmin());

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="post-card">
      <Link to={`/post/${post.id}`} className="post-link">
        <h2 className="post-title">{post.title}</h2>
        <p className="post-meta">
          By {post.author?.name} • {formatDate(post.createdAt)}
        </p>
        <p className="post-content-preview">
          {post.content.length > 200 
            ? `${post.content.substring(0, 200)}...` 
            : post.content}
        </p>
        {post.categories && post.categories.length > 0 && (
          <div className="post-categories">
            {post.categories.map(cat => (
              <span key={cat.id} className="category-tag">{cat.name}</span>
            ))}
          </div>
        )}
      </Link>
      {canEdit && (
        <div className="post-actions">
          <Link to={`/edit-post/${post.id}`} className="btn btn-secondary">
            Edit
          </Link>
          {canDelete && (
            <button onClick={() => onDelete(post.id)} className="btn btn-danger">
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;

