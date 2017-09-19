import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import {
  MemoryRouter,
  Route,
} from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import renderer from 'react-test-renderer';
import { configureStore } from './';

export const createTestWithRoutes = (routes, initialState) => {
  const store = configureStore(
    initialState,
  );

  const wrapper = renderer.create(
    <Provider store={store}>
      <IntlProvider locale="en">
        <MemoryRouter initialEntries={['/']}>
          {routes}
        </MemoryRouter>
      </IntlProvider>
    </Provider>
  );

  return {
    store,
    wrapper,
  };
};

export const nodeToComponent = (nodeOrComponent) => {
  if (typeof nodeOrComponent !== 'function') {
    return () => nodeOrComponent;
  }

  return nodeOrComponent;
};

export const createComponentWithRouter = (nodeOrComponent, initialState) => {
  const component = nodeToComponent(nodeOrComponent);
  let push = null;

  const HomePage = ({ history }) => {
    push = history.push;

    return <h1>Home page</h1>;
  };

  HomePage.propTypes = {
    history: PropTypes.object.isRequired,
  };

  const routes = (
    <main>
      <Route exact path="/" component={HomePage} />
      <Route path="/test-page" component={component} />
    </main>
  );

  const result = createTestWithRoutes(routes, initialState);
  result.history = { push };

  push('/test-page');

  return result;
};
