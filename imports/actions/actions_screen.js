import { HIDE_SCREEN_SPINNER, SHOW_SCREEN_SPINNER } from './action_types';

export const hideScreenSpinner = () => ({
  type: HIDE_SCREEN_SPINNER
});

export const showScreenSpinner = (msg = '') => ({
  type: SHOW_SCREEN_SPINNER,
  payload: { message: msg }
});