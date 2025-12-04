import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './UserProfile.css';

const UserProfile = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <div className="container">Please login to view your profile</div>;
  }

  return (
    <div className="container">
      <div className="profile-card">
        <h2>User Profile</h2>
        <div className="profile-info">
          <div className="profile-item">
            <label>Name:</label>
            <span>{user.name}</span>
          </div>
          <div className="profile-item">
            <label>Email:</label>
            <span>{user.email}</span>
          </div>
          <div className="profile-item">
            <label>Role:</label>
            <span>{user.role === 'ROLE_ADMIN' ? 'Admin' : 'User'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

