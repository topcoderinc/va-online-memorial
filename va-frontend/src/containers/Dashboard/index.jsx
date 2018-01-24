import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../actions/auth';

const Dashboard = ({ user, logout }) => {
  if (user.role !== 'ro') {
    window.location.href = '/admin/dashboard';
    return null;
  }
  return (
    <div className="page-wrapper">
      <h1>Dashboard</h1>
      <hr />
      <h4>Welcome {user.firstName} {user.lastName}!</h4>
      <hr />
      <button className="btn primary" onClick={logout}>Log out</button>
    </div>
  );
};

const mapStateToProps = (state) => ({ ...state.auth });

const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({ ...actions }, dispatch)
};

export default connect(mapStateToProps, matchDispatchToProps)(Dashboard);
