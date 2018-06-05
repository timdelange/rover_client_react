import { applyMiddleware, createStore, compose } from 'redux';
import { createLogger } from 'redux-logger';
import ReduxThunk from 'redux-thunk';
import rootReducer from './reducers';
import {persistStore, autoRehydrate} from 'redux-persist';

const logger = createLogger();

const enhancers = [
  //applyMiddleware(ReduxThunk, logger),
  applyMiddleware(ReduxThunk),
    autoRehydrate()
];

//const defstate = {"auth":{"username":"","password":"","inProgress":false,"loggedIn":true,"loginMessage":null},"route":{"scene":"delivery_document_form"},"screen":{"showSpinner":false},"deliveries":{"jobLimit":5,"search":"","current_delivery":"cPQsAD3JFv2NtqCX8","current_order_index":0}};
const defstate = {};

const Store = createStore(rootReducer, defstate, compose(...enhancers));

persistStore(Store);

export default Store;