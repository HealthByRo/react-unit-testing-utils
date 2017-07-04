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

export function shallowWithStore(node, initialState) {
  const store = configureStore(initialState);
  return shallow(node, { context: { store } });
}

export function mountWithStore(node, initialState) {
  const store = configureStore(initialState);
  return mount(node, {
    context: { store },
    childContextTypes: { store: PropTypes.object.isRequired },
  });
}

