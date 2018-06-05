import {
  DELIVERIES_LOAD_MORE, DELIVERIES_UPDATE_SEARCH,
  DELIVERIES_SELECT_DELIVERY,
  DELIVERY_ORDER_SELECT,
  DELIVERY_DOCUMENT_SELECT,
} from './action_types';

export const deliveriesLoadMore = (count=5) => ({
  type: DELIVERIES_LOAD_MORE,
  payload: count
});

export const deliveriesUpdateSearch = (search="") => ({
  type: DELIVERIES_UPDATE_SEARCH,
  payload: search
});

export const deliverySelect = (id) => ({
  type: DELIVERIES_SELECT_DELIVERY,
  payload: id
});

export const deliveryCustomerOrderSelect = (index) => ({
  type: DELIVERY_ORDER_SELECT,
  payload: index
});

export const deliveryDocumentSelect = (key) => ({
  type: DELIVERY_DOCUMENT_SELECT,
  payload: key
});

