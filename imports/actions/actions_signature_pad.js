import {
  SIGPAD_SET_CALLING_SCENE,
  SIGPAD_SET_SIG_ID
} from './action_types';


export const sigPadSetSigId = (value) => ({
  type: SIGPAD_SET_SIG_ID,
  payload: value
});

export const sigPadSetSignee = (value) => ({
  type: SIGPAD_SET_SIGNEE,
  payload: value
})

export const sigPadSetCallingScene = (scene) => ({
  type: SIGPAD_SET_CALLING_SCENE,
  payload: scene
});
