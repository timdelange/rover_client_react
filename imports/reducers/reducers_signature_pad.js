import {
  SIGPAD_SET_CALLING_SCENE,
  SIGPAD_SET_SIG_ID,
} from '../actions/action_types';

const DEFAULT_STATE = { id: null, calling_scene: 'main'};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {

    case SIGPAD_SET_CALLING_SCENE:
      return { ...state, calling_scene: action.payload };
    case SIGPAD_SET_SIG_ID:
      return { ...state, id: action.payload };

    default:
      return state;
  }
};
