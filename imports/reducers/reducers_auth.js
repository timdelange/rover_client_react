import {
  USERNAME_CHANGED,
  PASSWORD_CHANGED,
  LOGIN_IN_PROGRESS,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  LOGIN_LOGOUT
} from '../actions/action_types';

const DEFAULT_STATE = {
  username: '',
  password: '',
  inProgress: false,
  loggedIn: false,
  loginMessage: null
  //loginMessage: 'Enter your details and tap "SignIn"'
};


export default (state = DEFAULT_STATE, action) => {
  //console.log(action);
  switch (action.type) {
    case USERNAME_CHANGED:
      return { ...state, username: action.payload };
    case PASSWORD_CHANGED:
      return { ...state, password: action.payload };
    case LOGIN_IN_PROGRESS:
      return { ...state, inProgress: action.payload };
    case LOGIN_SUCCESS:
      return { ...state, loggedIn: action.payload, loginMessage: DEFAULT_STATE.loginMessage };
    case LOGIN_FAILED:
      return { ...state, loginMessage: action.payload };
    case LOGIN_LOGOUT:
      return { ...state, loggedIn: false };

    default:
      return state;
  }
};