import {
  DELIVERIES_LOAD_MORE, DELIVERIES_SELECT_DELIVERY,
  DELIVERIES_UPDATE_SEARCH,
  DELIVERY_ORDER_SELECT,
  DELIVERY_DOCUMENT_SELECT
} from '../actions/action_types';

const DEFAULT_STATE = { jobLimit: 5, search: "", current_delivery: null, current_order_index: 0, current_delivery_document_key: null };

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {

    case DELIVERY_DOCUMENT_SELECT:
      return { ...state, current_delivery_document_key: action.payload };
    case DELIVERY_ORDER_SELECT:
      return { ...state, current_order_index: action.payload };
    case DELIVERIES_SELECT_DELIVERY:
      return { ...state, current_delivery: action.payload };
    case DELIVERIES_UPDATE_SEARCH:
      return { ...state, search: action.payload };
    case DELIVERIES_LOAD_MORE:
      return { ...state, jobLimit: state.jobLimit + action.payload };

    default:
      return state;
  }
};
