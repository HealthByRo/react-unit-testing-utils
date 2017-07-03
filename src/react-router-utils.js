import React from 'react';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';
import { Provider } from 'react-redux';
import {
  Route,
  Router,
  browserHistory,
} from 'react-router';
import { combineReducers } from 'redux-immutable';
import createMemoryHistory from 'react-router/lib/createMemoryHistory';
import {
  createStore,
  applyMiddleware,
} from 'redux';
import {
  syncHistoryWithStore,
  routerMiddleware,
  LOCATION_CHANGE,
} from 'react-router-redux';
import { IntlProvider } from 'react-intl';
import renderer from 'react-test-renderer';

const getFakeReducersBasedOnInitialState = (initialState) => {
  const fakeReducers = {};

  Object.keys(initialState).forEach((key) => {
    fakeReducers[key] = (state) => state || fromJS(initialState[key]);
  });

  return fakeReducers;
};

const routeInitialState = fromJS({
  locationBeforeTransitions: null,
});

const routeReducer = (state = routeInitialState, action) => {
  switch (action.type) {
    case LOCATION_CHANGE:
      return state.merge({
        locationBeforeTransitions: action.payload,
      });
    default:
      return state;
  }
};

const makeSelectLocationState = () => {
  let prevRoutingState;
  let prevRoutingStateJS;

  return (state) => {
    const routingState = state.get('route');

    if (!routingState.equals(prevRoutingState)) {
      prevRoutingState = routingState;
      prevRoutingStateJS = routingState.toJS();
    }

    return prevRoutingStateJS;
  };
};

export const createTestWithRoutes = (routes, initialState) => {
  const baseHistory = createMemoryHistory();
  const middleware = routerMiddleware(baseHistory);
  const rootReducer = combineReducers({
    ...getFakeReducersBasedOnInitialState(initialState),
    route: routeReducer,
  });

  const store = createStore(
    rootReducer,
    fromJS(initialState),
    applyMiddleware(middleware)
  );

  const history = syncHistoryWithStore(browserHistory, store, {
    selectLocationState: makeSelectLocationState(),
  });

  const wrapper = renderer.create(
    <Provider store={store}>
      <IntlProvider locale="en">
        <Router history={history} >
          {routes}
        </Router>
      </IntlProvider>
    </Provider>
  );

  return {
    history,
    store,
    wrapper,
  };
};

const App = (props) => (
  <main>
    {props.children}
  </main>
);

App.propTypes = {
  children: PropTypes.node,
};

const HomePage = () => <h1>Home page</h1>;

export const fixComponent = (component) => {
  if (typeof component !== 'function') {
    return () => component;
  }

  return component;
};

export const createComponentWithRouter = (component, initialState) => {
  const fixedComponent = fixComponent(component);

  const routes = (
    <Route component={App} >
      <Route path="/" component={HomePage} />
      <Route path="/test-page" component={fixedComponent} />
    </Route>
  );

  const result = createTestWithRoutes(routes, initialState);

  result.history.push('/test-page');

  return result;
};
