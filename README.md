![IMAGE](./coverage.svg)

# react-unit-testing-utils

react-unit-testing-utils is a module with a set of useful functions to test react containers and components. 


## Installation
`yarn add https://github.com/HealthByRo/react-unit-testing-utils`

## Usage
### createComponentWithIntl(node, initialState = {})

createComponentWithIntl creates component with initial state and wrapped in Intl and redux providers and return object with wrapped component and store. 

#### Test snapshot of component with [Intl](https://github.com/yahoo/react-intl) and connected with [redux](http://redux.js.org/)

```js
import React from 'react';
import { createComponentWithIntl } from 'react-unit-testing-utils';

import SignInForm from './';

describe('<SignInForm />', () => {
  it('should render SignInForm', () => {
    const initialState = {};
    const { component, store } = createComponentWithIntl(<SignInForm />, initialState);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
```

### shallowWithIntl(node, context = {})
`shallowWithIntl` creates ShallowWrapper using [shallow](https://github.com/airbnb/enzyme/blob/master/docs/api/shallow.md) function from [enzyme](https://github.com/airbnb/enzyme) additionaly adding Intl context to renders component with Intl.

### mountWithIntl(node, context = {})
`mountWithIntl` creates ReactWrapper using [mount](https://github.com/airbnb/enzyme/blob/master/docs/api/mount.md) function from [enzyme](https://github.com/airbnb/enzyme) additionaly adding Intl context to renders component with Intl.

### createComponentWithRouter(componentOrNode, initialState)
#### Test snapshot of container with [Intl](https://github.com/yahoo/react-intl), [react-router](https://github.com/ReactTraining/react-router) and connected with [redux](http://redux.js.org/)

If your container requires some props which are passed down from react-router, you should use createComponentWithRouter function to put your component inside <Router> and <Route> components. 

createComponentWithRouter returns object with wrapped component, store and react-router history object: 
```js
...
const { wrapper, history, store } = createComponentWithRouter(<SignInPage />, initialState)
console.log(store.getActions());
console.log(store.getState());
history.push('/');
expect(wrapper.toJSON()).toMatchSnapshot();
...
```

By default your container is added to route under url a `/test-page ` and the url is opened automatically: `<Route path="/test-page" component={YourContainer} />`. 

If you want to define your own routes you need to use `createTestWithRoutes(routes, initialState)` and open url explicit:

```jsx
import React from 'react';
import { createTestWithRoutes } from 'react-unit-testing-utils';
import SignInPage from './index';

describe('<SignInPage />', () => {
  it('should NOT render SignInPage when user IS authenticated', () => {
    const initialState = {
      auth: {
        isAuthenticated: true,
        user: {
          id: 1,
          firstName: 'John',
          email: 'john@smith.com',
        },
      },
    };

    const App = (props) => (
      <main>
        {props.children}
      </main>
    );

    App.propTypes = {
      children: PropTypes.node,
    };

    const routes = (
      <Route component={App} >
        <Route path="/sign-in" component={SignInPage} />
      </Route>
    );

    const { wrapper, history } = createTestWithRoutes(routes, initialState);

    history.push('/sign-in');

    expect(wrapper.toJSON()).toMatchSnapshot();
  });
});
```

Usually, you should use it to test snapshot of page container which is wrapped in some [redux-auth-wrapper](https://github.com/mjrussell/redux-auth-wrapper) eq. **UserIsAuthenticated**.

**Note**: If ***redux-auth-wrapper*** doesn't allow to render page container it will return node only with `<main />` markup. What means that user has no access to view the container based on initialState and auth wrapper. 

```js
import React from 'react';
import { createComponentWithRouter } from 'react-unit-testing-utils';
import SignInPage from './index';

describe('<SignInPage />', () => {
  it('should NOT render SignInPage when user IS authenticated', () => {
    const initialState = {
      auth: {
        isAuthenticated: true,
        user: {
          id: 1,
          firstName: 'John',
          email: 'john@smith.com',
        },
      },
    };
    const { wrapper } = createComponentWithRouter(<SignInPage />, initialState);
    expect(wrapper.toJSON()).toMatchSnapshot();
  });
});
```

```js
import React from 'react';
import { createComponentWithRouter } from 'react-unit-testing-utils';
import SignInPage from './index';

describe('<SignInPage />', () => {
  it('should render SignInPage when user IS NOT authenticated', () => {
    const initialState = {
      auth: {
        isAuthenticated: false,
      },
      signInPage: {},
    };
    const { wrapper } = createComponentWithRouter(<SignInPage />, initialState);
    expect(wrapper.toJSON()).toMatchSnapshot();
  });
});
```

#### Test store actions
createComponentWithRouter returns wrapped component and store with additional function **getActions** which returns list of occurred actions. 

```js
import React from 'react';
import {
  findActionByType,
  createComponentWithRouter,
} from 'react-unit-testing-utils';
import SignInPage from './index';
import { destroyPageAction } from './actions';
import { DESTROY_PAGE_ACTION } from './constants';

describe('<SignInPage />', () => {
  it('should dispatch action DESTROY_PAGE_ACTION when the component unmount', () => {
    const initialState = {
      auth: {
        isAuthenticated: false,
      },
      signInPage: {},
    };
    const { wrapper, store } = createComponentWithRouter(<SignInPage />, initialState);
    wrapper.unmount();
    const recivedAction = findActionByType(store, DESTROY_PAGE_ACTION);
    expect(recivedAction).toEqual(destroyPageAction());
  });
});
```

### shallowWithStore(node, initialState)
`shallowWithStore` creates ShallowWrapper using [shallow](https://github.com/airbnb/enzyme/blob/master/docs/api/shallow.md) function from [enzyme](https://github.com/airbnb/enzyme) additionaly adding redux store context.
```js
import React from 'react';
import { shallowWithStore } from 'react-unit-testing-utils';
import ShippingAddressForm from './';

describe('ShippingAddressForm', () => {
  const initialValues = {
    name: 'John Doe',
    lastName: 'Doe',
    street: '228 Broadway',
    city: 'New York',
    state: 'NY',
    zip: '10003',
  };

  it('should render form', () => {
    const handleSubmit = jest.fn();
    const wrapper = shallowWithStore(<ShippingAddressForm initialValues={initialValues} handleSubmit={handleSubmit} />, {});
    expect(wrapper.find('form')).toMatchSnapshot();
  });
});

```
### mountWithStore(node, initialState)
`mountWithStore` creates ReactWrapper using [mount](https://github.com/airbnb/enzyme/blob/master/docs/api/mount.md) function from [enzyme](https://github.com/airbnb/enzyme) additionaly adding redux store context.

```js
import React from 'react';
import { mountWithStore } from 'react-unit-testing-utils';
import ShippingAddressForm from './';

describe('ShippingAddressForm', () => {
  const initialValues = {
    name: 'John Doe',
    lastName: 'Doe',
    street: '228 Broadway',
    city: 'New York',
    state: 'NY',
    zip: '10003',
  };

  it('should invoke handleSubmit function when submiting the form', () => {
    const handleSubmit = jest.fn();
    const wrapper = mountWithStore(<ShippingAddressForm initialValues={initialValues} handleSubmit={handleSubmit} />, {});
    wrapper.find('form').simulate('submit');
    expect(handleSubmit).toBeCalled();
  });
});
```

### configureStore(initialState, reducers = {}, middlewares = [])
`configureStore` creates store wit initial state and given reducers and middlewares. It returns real redux store which contains additional method `getActions()` which returns list of occurred actions.

```js
import React from 'react';
import { configureStore } from 'react-unit-testing-utils';

const initalState = {
  auth: {
    isAuthenticated: false,
  },
}; 

const store = configureStore(initalState);
```
