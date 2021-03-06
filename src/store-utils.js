import React from 'react';
import PropTypes from 'prop-types';
import {
  mount,
  shallow,
} from 'enzyme';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import {
  createStore,
  applyMiddleware,
} from 'redux';
import { combineReducers } from 'redux-immutable';
import renderer from 'react-test-renderer';

export function findActionByType(store, actionType) {
  return store.getActions().find((action) => action.type === actionType);
}

let actions = [];

const logger = () => (next) => (action) => {
  actions.push(action);
  return next(action);
};

export function configureStore(initialState, reducers = {}, middlewares = []) {
  const rootReducer = combineReducers({
    global: (state) => state || {},
    ...getFakeReducersBasedOnInitialState(initialState),
    ...reducers,
  });

  actions = [];

  const store = createStore(
    rootReducer,
    fromJS(initialState),
    applyMiddleware(...middlewares, logger)
  );

  store.getActions = () => actions;
  store.runSaga = () => {};
  store.asyncReducers = {};
  store.injectedReducers = {};
  store.injectedSagas = {};

  return store;
}

// backwards-compatible function name
export const getStoreWithInitialState = configureStore;

function getFakeReducersBasedOnInitialState(initialState) {
  const fakeReducers = {};

  Object.keys(initialState).forEach((key) => {
    fakeReducers[key] = (state) => state || fromJS(initialState[key]);
  });

  return fakeReducers;
}

export function createComponentWithStore(children, initialState = {}) {
  const store = configureStore(initialState);
  const component = renderer.create(
    <Provider store={store}>
      {children}
    </Provider>
  );

  return { component, store };
}

export function shallowWithStore(children, initialState = {}) {
  const store = configureStore(initialState);
  const node = (
    <Provider store={store}>
      {children}
    </Provider>
  );
  const result = shallow(node);

  result.store = store;

  return result;
}

export function mountWithStore(node, initialState) {
  const store = configureStore(initialState);
  const result = mount(node, {
    context: { store },
    childContextTypes: { store: PropTypes.object.isRequired },
  });

  result.store = store;

  return result;
}

