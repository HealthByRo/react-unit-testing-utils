import React from 'react';
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
