import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import actions from './actions/auth';
import Spinner from './components/Spinner';

const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register'
];

class Authenticator extends Component {
  componentWillMount() {
    this.props.checkAuth();
  }

  componentWillReceiveProps(nextProps) {
    const inPublicRoute = PUBLIC_ROUTES.indexOf(this.props.route) > -1;

    if (!nextProps.authenticated && !inPublicRoute) {
      window.location.href = '/login';
    } else if (nextProps.authenticated && inPublicRoute && this.props.route !== '/') {
      window.location.href = '/';
    }
  }

  render() {
    const inPublicRoute = PUBLIC_ROUTES.indexOf(this.props.route) > -1;

    if (!inPublicRoute && this.props.authCheckDone && this.props.authFailed) {
      return <Redirect to="/" />;
    } else if (inPublicRoute && this.props.route !== '/' && this.props.authCheckDone && this.props.authenticated) {
      if (this.props.user.role === 'admin') return <Redirect to="/admin/dashboard" />;
      else return <Redirect to="/dashboard" />;
    }
    if (this.props.authCheckStarted) return <Spinner />;
    return (<div>{this.props.children}</div>);
  }
}

const mapStateToProps = (state) => ({ ...state.auth });

const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({ ...actions }, dispatch)
};

export default connect(mapStateToProps, matchDispatchToProps)(Authenticator);
