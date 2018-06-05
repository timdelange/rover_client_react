import {
  SCENE_CHANGE,
  SCENE_STACK_PUSH,
} from '../actions/action_types';

const DEFAULT_STATE = { scene: 'login' };

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case SCENE_CHANGE:
      return { ...state, scene: action.payload };
    default:
      return state;
  }
};
