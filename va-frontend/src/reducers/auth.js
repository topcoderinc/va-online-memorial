const defaultState = {
  authenticated: false
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'AUTH_CHECK_STARTED':
      return {
        ...state,
        authCheckStarted: true,
        authCheckDone: false
      };
    case 'AUTH_FAILED':
      return {
        ...state,
        authCheckStarted: false,
        authenticated: false,
        authFailed: true,
        authCheckDone: true
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        authCheckStarted: false,
        authenticated: true,
        authFailed: false,
        authCheckDone: true,
        user: action.payload
      };
    case 'LOGIN_STARTED':
      return {
        ...state,
        loginStarted: true,
        loginDone: false
      };
    case 'LOGIN_FAILED':
      return {
        ...state,
        loginStarted: false,
        authenticated: false,
        loginFailed: true,
        loginDone: true,
        errorMessage: action.payload
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loginStarted: false,
        authenticated: true,
        loginFailed: false,
        loginDone: true,
        user: action.payload
      };
    case 'REGISTRATION_FAILED':
      return {
        ...state,
        registrationStarted: false,
        authenticated: false,
        registrationFailed: true,
        registrationDone: true,
        errorMessage: action.payload
      };
    case 'REGISTRATION_SUCCESS':
      return {
        ...state,
        registrationStarted: false,
        authenticated: true,
        registrationFailed: false,
        registrationDone: true,
        user: action.payload
      };
    case 'REGISTRATION_STARTED':
      return {
        ...state,
        registrationStarted: true,
        registrationDone: false
      };
    case 'LOGOUT':
      return {
        ...state,
        authenticated: false,
        user: null
      }
    default:
      return state;
  }
};
