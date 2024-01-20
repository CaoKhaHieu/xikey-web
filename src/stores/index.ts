import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import appMiddleware from './app-middleware';
import appReducer from './app-reducers';

const saga = createSagaMiddleware();

const middlewares: any = [saga];

const store = compose(applyMiddleware(...middlewares))(createStore)(appReducer);
saga.run(appMiddleware);

export default store;
