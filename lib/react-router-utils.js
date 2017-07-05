'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createComponentWithRouter = exports.nodeToComponent = exports.createTestWithRoutes = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _immutable = require('immutable');

var _reactRedux = require('react-redux');

var _reactRouter = require('react-router');

var _createMemoryHistory = require('react-router/lib/createMemoryHistory');

var _createMemoryHistory2 = _interopRequireDefault(_createMemoryHistory);

var _reactRouterRedux = require('react-router-redux');

var _reactIntl = require('react-intl');

var _reactTestRenderer = require('react-test-renderer');

var _reactTestRenderer2 = _interopRequireDefault(_reactTestRenderer);

var _ = require('./');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

  var store = (0, _.configureStore)(initialState, { route: routeReducer }, [middleware]);

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

var nodeToComponent = exports.nodeToComponent = function nodeToComponent(nodeOrComponent) {
  if (typeof nodeOrComponent !== 'function') {
    return function () {
      return nodeOrComponent;
    };
  }

  return nodeOrComponent;
};

var createComponentWithRouter = exports.createComponentWithRouter = function createComponentWithRouter(nodeOrComponent, initialState) {
  var component = nodeToComponent(nodeOrComponent);

  var routes = _react2.default.createElement(
    _reactRouter.Route,
    { component: App },
    _react2.default.createElement(_reactRouter.Route, { path: '/', component: HomePage }),
    _react2.default.createElement(_reactRouter.Route, { path: '/test-page', component: component })
  );

  var result = createTestWithRoutes(routes, initialState);

  result.history.push('/test-page');

  return result;
};