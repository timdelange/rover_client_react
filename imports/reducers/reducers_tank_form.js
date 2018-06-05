import {
  TANK_FORM_SET_CALLING_SCENE,
  TANK_FORM_SET_TANK_NO
} from '../actions/action_types';

const DEFAULT_STATE = { tank_no: 0, calling_scene: 'main'};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {

    case TANK_FORM_SET_CALLING_SCENE:
      return { ...state, calling_scene: action.payload };
    case TANK_FORM_SET_TANK_NO:
      return { ...state, tank_no: action.payload };

    default:
      return state;
  }
};
