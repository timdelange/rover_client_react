import {
  USERNAME_CHANGED,
  PASSWORD_CHANGED,
  LOGIN_IN_PROGRESS,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  LOGIN_LOGOUT,
  REQUEST_LOGIN
} from './action_types';

import { sceneChange } from './actions_route';
import { showScreenSpinner, hideScreenSpinner } from './actions_screen';

export const usernameChanged = (text) => ({
    type: USERNAME_CHANGED,
    payload: text
});

export const passwordChanged = (text) => ({
    type: PASSWORD_CHANGED,
    payload: text
});

export const loginSuccess = (bool) => ({
    type: LOGIN_SUCCESS,
    payload: bool
});

export const loginFailed = (error) => ({
    type: LOGIN_FAILED,
    payload: error
});

export const loginInProgress = (bool) => ({
    type: LOGIN_IN_PROGRESS,
    payload: bool
});

export const requestLogin = (username, password, backend) => ((dispatch) => {
  dispatch({ type: REQUEST_LOGIN });
  dispatch(loginInProgress(true));
  dispatch(showScreenSpinner('Logging In'));
  const promise = backend.login(username, password)
  .then(() => {
    dispatch(loginInProgress(false));
    dispatch(loginSuccess(true));
    dispatch(sceneChange('main'));
    dispatch(hideScreenSpinner());
  })
  .catch(() => {
    dispatch(loginFailed('Incorrect Username or Password'));
    dispatch(loginInProgress(false));
    dispatch(hideScreenSpinner());
  });
  return promise;
});

export const logOut = (backend) => ((dispatch) => {
  dispatch(showScreenSpinner());
  return backend.logout()
  .then(() => {
    dispatch({ type: LOGIN_LOGOUT });
    dispatch(passwordChanged(''));
    dispatch(hideScreenSpinner());
    dispatch(sceneChange('login'));
  }).catch(error => {
    throw error;
  });
});
