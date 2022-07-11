// import {createStore} from 'redux';
import reducer from './reducers/reducer';
import thunk from 'redux-thunk';
import { createStore, compose, applyMiddleware } from 'redux';

export const store = createStore(reducer, compose(
  applyMiddleware(
    thunk,
  ),
//  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
));

