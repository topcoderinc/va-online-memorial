import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../actions/auth';

const AdminDashboard = ({ user, logout }) => {
  if (user.role !== 'admin') {
    window.location.href = '/';
    return null;
  }
  return (
    <div className="page-wrapper">
      <h1>Admin Dashboard</h1>
      <hr />
      <h4>Welcome {user.firstName} {user.lastName}!</h4>
      <hr />
      <button className="btn primary" onClick={logout}>Log out</button>
    </div>
  );
};

AdminDashboard.defaultProps = {
  user: {}
};

const mapStateToProps = (state) => ({ ...state.auth });

const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({ ...actions }, dispatch)
};

export default connect(mapStateToProps, matchDispatchToProps)(AdminDashboard);
