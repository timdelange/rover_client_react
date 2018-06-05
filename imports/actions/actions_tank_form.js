import {
  TANK_FORM_SET_CALLING_SCENE,
  TANK_FORM_SET_TANK_NO
} from './action_types';


export const tankFormSetTankNo = (value) => ({
  type: TANK_FORM_SET_TANK_NO,
  payload: value
});

export const setTankFormCallingScene = (scene) => ({
  type: TANK_FORM_SET_CALLING_SCENE,
  payload: scene
});
