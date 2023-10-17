import reducers from "./reducer"
import { createStore, combineReducers, applyMiddleware } from 'redux';
import reduxSaga from 'redux-saga';
import rootSaga from './sagas';
import AsyncStorage from "@react-native-async-storage/async-storage";
 
const reduxSagaMiddleware = reduxSaga();

const rootReducers = combineReducers({ ...reducers });

export const store = createStore(
  rootReducers,
  applyMiddleware(reduxSagaMiddleware)
);

reduxSagaMiddleware.run(rootSaga);