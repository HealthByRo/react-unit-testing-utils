'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createComponentWithRouter = exports.fixComponent = exports.createTestWithRoutes = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _immutable = require('immutable');

var _reactRedux = require('react-redux');

var _reactRouter = require('react-router');

var _reduxImmutable = require('redux-immutable');

var _createMemoryHistory = require('react-router/lib/createMemoryHistory');

var _createMemoryHistory2 = _interopRequireDefault(_createMemoryHistory);

var _redux = require('redux');

var _reactRouterRedux = require('react-router-redux');

var _reactIntl = require('react-intl');

var _reactTestRenderer = require('react-test-renderer');

var _reactTestRenderer2 = _interopRequireDefault(_reactTestRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getFakeReducersBasedOnInitialState = function getFakeReducersBasedOnInitialState(initialState) {
  var fakeReducers = {};

  Object.keys(initialState).forEach(function (key) {
    fakeReducers[key] = function (state) {
      return state || (0, _immutable.fromJS)(initialState[key]);
    };
  });

  return fakeReducers;
};

var routeInitialState = (0, _immutable.fromJS)({
  locationBeforeTransitions: null
});

var routeReducer = function routeReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : routeInitialState;
  var action = arguments[1];

  switch (action.type) {
    case _reactRouterRedux.LOCATION_CHANGE:
      return state.merge({
        locationBeforeTransitions: action.payload
      });
    default:
      return state;
  }
};

var makeSelectLocationState = function makeSelectLocationState() {
  var prevRoutingState = void 0;
  var prevRoutingStateJS = void 0;

  return function (state) {
    var routingState = state.get('route');

    if (!routingState.equals(prevRoutingState)) {
      prevRoutingState = routingState;
      prevRoutingStateJS = routingState.toJS();
    }

    return prevRoutingStateJS;
  };
};

var createTestWithRoutes = exports.createTestWithRoutes = function createTestWithRoutes(routes, initialState) {
  var baseHistory = (0, _createMemoryHistory2.default)();
  var middleware = (0, _reactRouterRedux.routerMiddleware)(baseHistory);
  var rootReducer = (0, _reduxImmutable.combineReducers)(_extends({}, getFakeReducersBasedOnInitialState(initialState), {
    route: routeReducer
  }));

  var store = (0, _redux.createStore)(rootReducer, (0, _immutable.fromJS)(initialState), (0, _redux.applyMiddleware)(middleware));

  var history = (0, _reactRouterRedux.syncHistoryWithStore)(_reactRouter.browserHistory, store, {
    selectLocationState: makeSelectLocationState()
  });

  var wrapper = _reactTestRenderer2.default.create(_react2.default.createElement(
    _reactRedux.Provider,
    { store: store },
    _react2.default.createElement(
      _reactIntl.IntlProvider,
      { locale: 'en' },
      _react2.default.createElement(
        _reactRouter.Router,
        { history: history },
        routes
      )
    )
  ));

  return {
    history: history,
    store: store,
    wrapper: wrapper
  };
};

var App = function App(props) {
  return _react2.default.createElement(
    'main',
    null,
    props.children
  );
};

App.propTypes = {
  children: _propTypes2.default.node
};

var HomePage = function HomePage() {
  return _react2.default.createElement(
    'h1',
    null,
    'Home page'
  );
};

var fixComponent = exports.fixComponent = function fixComponent(component) {
  if (typeof component !== 'function') {
    return function () {
      return component;
    };
  }

  return component;
};

var createComponentWithRouter = exports.createComponentWithRouter = function createComponentWithRouter(component, initialState) {
  var fixedComponent = fixComponent(component);

  var routes = _react2.default.createElement(
    _reactRouter.Route,
    { component: App },
    _react2.default.createElement(_reactRouter.Route, { path: '/', component: HomePage }),
    _react2.default.createElement(_reactRouter.Route, { path: '/test-page', component: fixedComponent })
  );

  var result = createTestWithRoutes(routes, initialState);

  result.history.push('/test-page');

  return result;
};