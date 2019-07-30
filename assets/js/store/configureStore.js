import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createRootReducer from 'reducers/rootReducer';

// See: https://github.com/zalmoxisus/redux-devtools-extension
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore(initialState = {}) {
  return createStore(
    createRootReducer(),
    initialState,
    composeEnhancers(
      applyMiddleware(thunk)
    )
  );
}
