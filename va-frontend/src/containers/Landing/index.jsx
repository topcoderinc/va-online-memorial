import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../actions/auth';
import LandingComponent from '../../components/Landing';

const Landing = ({ user, logout }) => (
  <div className="page-wrapper">
    <LandingComponent user={user} logout={logout} />
  </div>
);

const mapStateToProps = (state) => ({ ...state.auth });

const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({ ...actions }, dispatch)
};

export default connect(mapStateToProps, matchDispatchToProps)(Landing);
