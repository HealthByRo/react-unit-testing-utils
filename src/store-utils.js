import React from 'react';
import PropTypes from 'prop-types';
import {
  mount,
  shallow,
} from 'enzyme';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import renderer from 'react-test-renderer';

export function findActionByType(store, actionType) {
  return store.getActions().find((action) => action.type === actionType);
}

export function getStoreWithInitialState(initialState) {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  return mockStore(fromJS(initialState));
}

export function createComponentWithStore(children, initialState = {}) {
  const store = getStoreWithInitialState(initialState);
  const component = renderer.create(
    <Provider store={store}>
      {children}
    </Provider>
  );

  return { component, store };
}

export function shallowWithStore(node, initialState) {
  const store = getStoreWithInitialState(initialState);
  return shallow(node, { context: { store } });
}

export function mountWithStore(node, initialState) {
  const store = getStoreWithInitialState(initialState);
  return mount(node, {
    context: { store },
    childContextTypes: { store: PropTypes.object.isRequired },
  });
}

function nodeWithStoreProp(node, store) {
  return React.cloneElement(node);
}

