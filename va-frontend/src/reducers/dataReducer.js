import * as types from '../constants/actionTypes';

const defaultState = {
  db: {}
};


export default (state = defaultState, action) => {
  switch (action.type) {
    case types.LOAD_DATA:
      return {
        ...state,
        db: action.data
      };
    case 'AUTH_FAILED':
      return {
        ...state,
        authCheckStarted: false,
        authenticated: false,
        authFailed: true,
        authCheckDone: true
      };
    default:
      return state;
  }
};