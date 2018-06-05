import {
  IMAGE_SELECT,
  IMAGE_SET_CALLING_SCENE
} from './action_types';


export const imageSelect = (image) => ({
  type: IMAGE_SELECT,
  payload: image
});

export const setImageViewCallingScene = (scene) => ({
  type: IMAGE_SET_CALLING_SCENE,
  payload: scene
});
