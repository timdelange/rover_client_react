import { combineReducers } from 'redux';
import AuthReducer from './reducers_auth';
import RouteReducer from './reducers_route';
import ScreenReducer from './reducers_screen';
import DeliveriesReducer from './reducers_deliveries';
import ImageViewReducer from './reducers_image_view';
import TankFormReducer from './reducers_tank_form';
import SignaturePadReducer from './reducers_signature_pad';

export default combineReducers({
  auth: AuthReducer,
  route: RouteReducer,
  screen: ScreenReducer,
  deliveries: DeliveriesReducer,
  image_view: ImageViewReducer,
  tank_form: TankFormReducer,
  signature_pad: SignaturePadReducer
});