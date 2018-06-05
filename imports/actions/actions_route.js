import { SCENE_CHANGE } from './action_types';

export const sceneChange = (scene, options = {pushState:true, bottom:false}) => {

  if (options.pushState) window.history.pushState({scene, bottom: options.bottom}, scene);
  return ({
    type: SCENE_CHANGE,
    payload: scene
  });
};



