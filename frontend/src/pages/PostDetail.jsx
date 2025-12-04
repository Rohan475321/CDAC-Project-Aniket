import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import './PostDetail.css';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [loading, setLoading] = useState(true);
  const { user, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await api.get(`/posts/${id}`);
      setPost(response.data);
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await api.get(`/comments/post/${id}`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await api.post(`/comments/post/${id}`, { content: commentContent });
      setCommentContent('');
      fetchComments();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to create comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await api.delete(`/comments/${commentId}`);
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to delete comment');
    }
  };

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

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (!post) {
    return <div className="container">Post not found</div>;
  }

  const canEditPost = user && (user.id === post.authorId || isAdmin());
  const canDeletePost = user && (user.id === post.authorId || isAdmin());

  return (
    <div className="container">
      <div className="post-detail">
        <h1>{post.title}</h1>
        <p className="post-meta">
          By {post.author?.name} • {formatDate(post.createdAt)}
        </p>
        {canEditPost && (
          <div className="post-actions">
            <Link to={`/edit-post/${post.id}`} className="btn btn-secondary">
              Edit Post
            </Link>
          </div>
        )}
        <div className="post-content">{post.content}</div>
        {post.categories && post.categories.length > 0 && (
          <div className="post-categories">
            {post.categories.map(cat => (
              <span key={cat.id} className="category-tag">{cat.name}</span>
            ))}
          </div>
        )}
      </div>

      <div className="comments-section">
        <h2>Comments ({comments.length})</h2>
        {user ? (
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <div className="form-group">
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Write a comment..."
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Add Comment
            </button>
          </form>
        ) : (
          <p className="login-prompt">
            <Link to="/login">Login</Link> to add a comment
          </p>
        )}

        <div className="comments-list">
          {comments.length === 0 ? (
            <p>No comments yet. Be the first to comment!</p>
          ) : (
            comments.map(comment => {
              const canDeleteComment = user && (user.id === comment.authorId || isAdmin());
              return (
                <div key={comment.id} className="comment-card">
                  <div className="comment-header">
                    <strong>{comment.author?.name}</strong>
                    <span className="comment-date">{formatDate(comment.createdAt)}</span>
                  </div>
                  <div className="comment-content">{comment.content}</div>
                  {canDeleteComment && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;

