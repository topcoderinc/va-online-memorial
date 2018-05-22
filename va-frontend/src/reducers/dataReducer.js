import * as types from '../constants/actionTypes';

const defaultState = {
  db: {},
  veterans: {},
  branches: {},
  cemeteries: {},
  filters: {},
  settingPreferences: {},
  nokRequests: {},
  reviewRequests: {},
  archivedRequests: {},
  reviewPosts: {},
  myPosts: {},
  flaggedPosts: {},
  veteranNames: {}
};


export default (state = defaultState, action) => {
  switch (action.type) {
    case types.LOAD_DATA:
      return {
        ...state,
        db: action.data
      };
    case types.LOAD_VETERANS:
      return {
        ...state,
        veterans: action.data
      };
    case types.LOAD_VETERANS_NAME:
      return {
        ...state,
        veteranNames: action.data,
      };
    case types.LOAD_BRANCHES:
      return {
        ...state,
        branches: action.data
      };
    case types.LOAD_CEMETERIES:
      return {
        ...state,
        cemeteries: action.data
      };
    case types.UPDATE_FILTERS:
      return {
        ...state,
        filters: action.data
      };
    case types.LOAD_PREFERENCES:
      return {
        ...state,
        settingPreferences: action.data
      };
    case types.LOAD_NOK_REQUEST:
      return {
        ...state,
        nokRequests: action.data
      };
    case types.LOAD_REVIEW_POSTS:
      return {
        ...state,
        reviewPosts: action.data
      };
    case types.LOAD_MY_POSTS:
      return {
        ...state,
        myPosts: action.data
      };
    case types.LOAD_NOK_ARCHIVED_REQUEST:
      return {
        ...state,
        archivedRequests: action.data
      };
    case types.LOAD_NOK_REVIEW_REQUEST:
      return {
        ...state,
        reviewRequests: action.data
      };
    case types.LOAD_FLAGGED_POSTS:
      return {
        ...state,
        flagged: action.data
      };
    case types.AUTH_FAILED:
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
