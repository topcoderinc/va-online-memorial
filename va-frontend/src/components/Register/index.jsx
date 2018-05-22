import React, {Component} from 'react';
import Spinner from '../Spinner';
import {omit, each} from 'lodash';
import './styles.css';

const REGISTRATION_FIELDS = [
  {
    name: 'email',
    type: 'text',
    title: 'E-mail'
  },
  {
    name: 'firstName',
    type: 'text',
    title: 'First name'
  },
  {
    name: 'lastName',
    type: 'text',
    title: 'Last name'
  },
  {
    name: 'country',
    type: 'text',
    title: 'Country'
  },
  {
    name: 'password',
    type: 'password',
    title: 'Password'
  }
];

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      firstName: '',
      lastName: '',
      country: '',
      password: '',
      errors: {},
      hasErrors: false
    };
  }
  
  register = (e) => {
    e.preventDefault();
    if (this.props.loading) return;
    const errors = {};
    let hasErrors = false;
    
    const setError = (model) => {
      errors[ model ] = true;
      hasErrors = true;
    };
    
    // Validate input
    each(REGISTRATION_FIELDS, (field) => {
      if (this.state[ field.name ].trim() === '') setError(field.name);
    });
    
    this.setState({ errors, hasErrors });
    
    if (!hasErrors) {
      this.props.register(omit(this.state, [ 'errors', 'hasErrors' ]));
    }
  };
  
  onValueChange = (model, value) => {
    const newState = this.state;
    newState[ model ] = value;
    newState.errors = {};
    newState.hasErrors = false;
    this.setState(newState);
  };
  
  render() {
    return (
      <div className="register-page">
        <form onSubmit={this.register} className={`register-form ${this.props.failed ? 'error' : ''}`}>
          <h3>Create new account</h3>
          {
            REGISTRATION_FIELDS.map((field) => (
              <div className="form-field" key={field.name}>
                <input
                  type={field.type}
                  className={`input ${this.state.errors[ field.name ] ? 'error' : ''}`}
                  placeholder={field.title}
                  value={this.state[ field.name ]}
                  onChange={(e) => this.onValueChange(field.name, e.target.value)}/>
              </div>
            ))
          }
          {this.props.loading && <Spinner/>}
          {this.props.failed && <h2 className="error">{this.props.errorMessage}</h2>}
          <button type="submit" className="btn primary">Register</button>
        </form>
      </div>
    );
  }
}

export default Register;
