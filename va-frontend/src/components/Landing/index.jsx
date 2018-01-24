import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

const Landing = ({ user, logout }) => (
  <div className="landing-page">
    <div className="center-box">
      <h3>VA Online Memorial</h3>
      <hr />
      {
        !user ?
        <div>
          <Link to="/login" className="btn primary">Log in</Link>
          <hr />
          <Link to="/register" className="btn primary">Register</Link>
        </div> :
        <div>
          <h4>Welcome, {user.firstName} {user.lastName}!</h4>
          <hr />
          <Link to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} className="btn primary">
            Go to dashboard
          </Link>
          <hr />
          <button className="btn primary" onClick={logout}>Log out</button>
        </div>
      }
    </div>
  </div>
);

export default Landing
