import {
  HIDE_SCREEN_SPINNER,
  SHOW_SCREEN_SPINNER } from '../actions/action_types';

const DEFAULT_STATE = { showSpinner: false };

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case SHOW_SCREEN_SPINNER:
      return { ...state, showSpinner: true, spinnerMessage: action.payload.message };
    case HIDE_SCREEN_SPINNER:
      return { ...state, showSpinner: false };
    default:
      return state;
  }
};