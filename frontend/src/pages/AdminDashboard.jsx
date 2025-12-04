import React from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="container">
      <h1>Admin Dashboard</h1>
      <div className="admin-grid">
        <Link to="/admin/users" className="admin-card">
          <h3>Manage Users</h3>
          <p>View, edit, and delete users</p>
        </Link>
        <Link to="/admin/categories" className="admin-card">
          <h3>Manage Categories</h3>
          <p>Create, edit, and delete categories</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;

