import React, { Component } from 'react';
import Spinner from '../Spinner';
import { omit } from 'lodash';
import './styles.css';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      errors: {},
      hasErrors: false
    };
  }

  login = (e) => {
    e.preventDefault();
    if (this.props.loading) return;
    const errors = {};
    let hasErrors = false;

    const setError = (model) => {
      errors[model] = true;
      hasErrors = true;
    }

    // Validate input
    if (this.state.email.trim() === '') setError('email');
    if (this.state.password.trim() === '') setError('password');

    this.setState({ errors, hasErrors });

    if (!hasErrors) {
      this.props.login(omit(this.state, ['errors', 'hasErrors']));
    }
  }

  onValueChange = (model, value) => {
    const newState = this.state;
    newState[model] = value;
    newState.errors = {};
    newState.hasErrors = false;
    this.setState(newState);
  };

  render() {
    return (
      <div className="login-page">
        <form onSubmit={this.login} className={`login-form ${this.props.failed ? 'error' :''}`}>
          <h3>Please Login to Continue</h3>
          <div className="form-field">
            <input
              type="text"
              className={`input ${this.state.errors.email ? 'error' : ''}`}
              placeholder="E-mail"
              value={this.state.email}
              onChange={(e) => this.onValueChange('email', e.target.value)} />
          </div>
          <div className="form-field">
            <input
              type="password"
              className={`input ${this.state.errors.password ? 'error' : ''}`}
              placeholder="Password"
              value={this.state.password}
              onChange={(e) => this.onValueChange('password', e.target.value)} />
          </div>
          {this.props.loading && <Spinner />}
          {this.props.failed && <h2 className="error">{this.props.errorMessage}</h2>}
          <button type="submit" className="btn primary">Log In</button>
        </form>
      </div>
    );
  }
}

export default Login;
