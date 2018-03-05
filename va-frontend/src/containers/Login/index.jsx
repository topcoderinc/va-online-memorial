import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../actions/auth';

const Login = ({ authenticated, loginDone, loginStarted, loginFailed, login, errorMessage }) => (
  <div className="page-wrapper">
   {/* <LoginComponent
      loading={loginStarted}
      failed={loginFailed && loginDone}
      errorMessage={errorMessage}
      login={login}/>*/}
  </div>
);

const mapStateToProps = (state) => ({ ...state.auth });

const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({ ...actions }, dispatch)
};

export default connect(mapStateToProps, matchDispatchToProps)(Login);
