import API from '../services/auth';
import * as types from '../constants/actionTypes';
import {toast} from 'react-toastify';

/**
 * Check if user is athenticated
 */
function checkAuth(user) {
  return (dispatch) => {
    if (user) {
      dispatch({ type: types.AUTH_SUCCESS, payload: user });
    } else {
      dispatch({ type: types.AUTH_FAILED });
    }
  };
}

/**
 * Login
 * @param {object} user - The user info
 */
function login(user) {
  return (dispatch) => {
    dispatch({ type: types.LOGIN_SUCCESS, payload: user });
  };
}

/**
 * Register user
 * @param {object} formData - The user details object
 */
function register(formData) {
  return (dispatch) => {
    dispatch({ type: types.REGISTRATION_STARTED });
    API.register(formData, (error, user) => {
      if (error) return dispatch({ type: types.REGISTRATION_FAILED, payload: error });
      dispatch({ type: types.REGISTRATION_SUCCESS, payload: user });
    })
  };
}

/**
 * Logout
 */
function logout() {
  return (dispatch) => {
    API.logout();
    dispatch({ type: types.LOGOUT });
  };
}

function loadProfile(data) {
  return { type: types.UPDATE_PROFILE, payload: data };
}

function deactivateSuccess() {
  return { type: types.DEACTIVATE_SUCCESS };
}

function updateProfile(id, profile) {
  return function (dispatch) {
    API.updateProfile(id, profile).then(data => {
      dispatch(loadProfile(data));
      toast('change saved success', { type: 'info' });
    });
  }
}

function deactivate() {
  return function (dispatch) {
    API.deactivate().then(() => {
      dispatch(deactivateSuccess());
      toast('deactivate success', { type: 'info' });
    });
  }
}

export default {
  checkAuth,
  login,
  register,
  logout,
  updateProfile,
  deactivate
};
