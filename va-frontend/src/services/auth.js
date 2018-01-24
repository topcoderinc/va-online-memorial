import {
  API_URL as FALLBACK_API_URL,
  DEFAULT_SERVER_ERROR,
  STATUS_OK
} from '../config';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const API_URL = process.env.REACT_APP_API_URL || FALLBACK_API_URL;

/**
 * Login
 * @param credentials {object} - the login credentials
 * @param cb {function} - the callback function
 */
function login(credentials, cb) {
  console.log(credentials);
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  };
  fetch(`${API_URL}/login`, options)
  .then((res) => res.json())
  .then((json) => {
    if (json.code && json.code !== STATUS_OK) return cb(json.message || DEFAULT_SERVER_ERROR);
    cookies.set('userDetails', JSON.stringify(json));
    return cb(null, json);
  })
  .catch(() => cb(DEFAULT_SERVER_ERROR));
}

/**
 * Register user
 * @param formData {object} - the user details object
 * @param cb {function} - the callback function
 */
function register(formData, cb) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  };
  fetch(`${API_URL}/register`, options)
  .then((res) => res.json())
  .then((json) => {
    if (json.code && json.code !== STATUS_OK) return cb(json.message || DEFAULT_SERVER_ERROR);
    cookies.set('userDetails', JSON.stringify(json));
    return cb(null, json);
  })
  .catch(() => cb(DEFAULT_SERVER_ERROR));
}

/**
 * Check if user is already logged in
 * @param cb {function} - the callback function
 */
function checkAuth(cb) {
  const userDetails = cookies.get('userDetails');
  if (!userDetails) {
    return cb(new Error());
  }
  cb(null, userDetails);
}

/**
 * Logout user
 */
function logout(cb) {
  cookies.remove('userDetails');
}

export default {
 login,
 register,
 checkAuth,
 logout
};
