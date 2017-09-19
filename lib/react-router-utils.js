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

var _reactRouterDom = require('react-router-dom');

var _reactIntl = require('react-intl');

var _reactTestRenderer = require('react-test-renderer');

var _reactTestRenderer2 = _interopRequireDefault(_reactTestRenderer);

var _ = require('./');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const routeInitialState = fromJS({
//   locationBeforeTransitions: null,
// });

// const routeReducer = (state = routeInitialState, action) => {
//   switch (action.type) {
//     case LOCATION_CHANGE:
//       return state.merge({
//         locationBeforeTransitions: action.payload,
//       });
//     default:
//       return state;
//   }
// };

// const makeSelectLocationState = () => {
//   let prevRoutingState;
//   let prevRoutingStateJS;

//   return (state) => {
//     const routingState = state.get('route');

//     if (!routingState.equals(prevRoutingState)) {
//       prevRoutingState = routingState;
//       prevRoutingStateJS = routingState.toJS();
//     }

//     return prevRoutingStateJS;
//   };
// };

// import {
//   Route,
//   // Router,
//   // browserHistory,
// } from 'react-router';
var createTestWithRoutes = exports.createTestWithRoutes = function createTestWithRoutes(routes, initialState) {
  var store = (0, _.configureStore)(initialState);

  // const history = syncHistoryWithStore(browserHistory, store, {
  //   selectLocationState: makeSelectLocationState(),
  // });

  var wrapper = _reactTestRenderer2.default.create(_react2.default.createElement(
    _reactRedux.Provider,
    { store: store },
    _react2.default.createElement(
      _reactIntl.IntlProvider,
      { locale: 'en' },
      _react2.default.createElement(
        _reactRouterDom.MemoryRouter,
        { initialEntries: ['/'] },
        routes
      )
    )
  ));

  return {
    store: store,
    wrapper: wrapper
  };
};
// import {
//   // syncHistoryWithStore,
//   LOCATION_CHANGE,
// } from 'react-router-redux';
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
  var push = null;
  var HomePage = function HomePage(_ref) {
    var history = _ref.history;

    push = history.push;

    return _react2.default.createElement(
      'h1',
      null,
      'Home page'
    );
  };

  HomePage.propTypes = {
    history: _propTypes2.default.object.isRequired
  };

  var routes = _react2.default.createElement(
    'main',
    null,
    _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: '/', component: HomePage }),
    _react2.default.createElement(_reactRouterDom.Route, { path: '/test-page', component: component })
  );

  var result = createTestWithRoutes(routes, initialState);

  push('/test-page');

  return result;
};