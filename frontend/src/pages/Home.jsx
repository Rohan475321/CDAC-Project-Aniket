import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import PostCard from '../components/PostCard';
import { AuthContext } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await api.delete(`/posts/${postId}`);
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to delete post');
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <h1>All Posts</h1>
      {posts.length === 0 ? (
        <div className="no-posts">
          <p>No posts yet. Be the first to create one!</p>
          {user && (
            <button onClick={() => navigate('/create-post')} className="btn btn-primary">
              Create Post
            </button>
          )}
        </div>
      ) : (
        <div className="posts-grid">
          {posts.map(post => (
            <PostCard key={post.id} post={post} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;

