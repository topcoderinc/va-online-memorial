import API from '../services/auth';

/**
 * Check if user is athenticated
 */
function checkAuth() {
  return (dispatch) => {
    dispatch({ type: 'AUTH_CHECK_STARTED' });
    API.checkAuth((error, user) => {
      if (error) return dispatch({ type: 'AUTH_FAILED' });
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
    });
  };
}

/**
 * Login
 * @param {object} credentials - The login credentials
 */
function login(credentials) {
  return (dispatch) => {
    dispatch({ type: 'LOGIN_STARTED' });
    API.login(credentials, (error, user) => {
      if (error) return dispatch({ type: 'LOGIN_FAILED', payload: error });
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    })
  };
}

/**
 * Register user
 * @param {object} formData - The user details object
 */
function register(formData) {
  return (dispatch) => {
    dispatch({ type: 'REGISTRATION_STARTED' });
    API.register(formData, (error, user) => {
      console.log(error);
      console.log(user);
      if (error) return dispatch({ type: 'REGISTRATION_FAILED', payload: error });
      dispatch({ type: 'REGISTRATION_SUCCESS', payload: user });
    })
  };
}

/**
 * Logout
 */
function logout() {
  return (dispatch) => {
    API.logout();
    dispatch({ type: 'LOGOUT' });
  };
}

export default {
  checkAuth,
  login,
  register,
  logout
};
