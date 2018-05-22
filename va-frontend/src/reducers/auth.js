import * as types from '../constants/actionTypes';

const defaultState = {
  authenticated: false
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case types.LOGIN_SUCCESS:
      return {
        ...state,
        authenticated: true,
        user: action.payload
      };
    case types.AUTH_SUCCESS:
      return {
        ...state,
        authenticated: true,
        user: action.payload
      };
    case types.AUTH_FAILED:
      return {
        ...state,
        authenticated: false,
        user: null
      };
    case types.UPDATE_PROFILE:
      return {
        ...state,
        user: action.payload
      };
    case types.LOGOUT:
      return {
        ...state,
        authenticated: false,
        user: null
      };
    default:
      return state;
  }
};
