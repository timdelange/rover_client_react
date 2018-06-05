import {
  IMAGE_SELECT,
  IMAGE_SET_CALLING_SCENE
} from '../actions/action_types';

const DEFAULT_STATE = { selected_image: null, calling_scene: 'main'};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {

    case IMAGE_SET_CALLING_SCENE:
      return { ...state, calling_scene: action.payload };
    case IMAGE_SELECT:
      return { ...state, selected_image: action.payload };

    default:
      return state;
  }
};
