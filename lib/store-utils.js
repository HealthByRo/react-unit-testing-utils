'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStoreWithInitialState = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.findActionByType = findActionByType;
exports.configureStore = configureStore;
exports.createComponentWithStore = createComponentWithStore;
exports.shallowWithStore = shallowWithStore;
exports.mountWithStore = mountWithStore;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _enzyme = require('enzyme');

var _reactRedux = require('react-redux');

var _immutable = require('immutable');

var _redux = require('redux');

var _reduxImmutable = require('redux-immutable');

var _reactTestRenderer = require('react-test-renderer');

var _reactTestRenderer2 = _interopRequireDefault(_reactTestRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function findActionByType(store, actionType) {
  return store.getActions().find(function (action) {
    return action.type === actionType;
  });
}

var actions = [];

var logger = function logger() {
  return function (next) {
    return function (action) {
      actions.push(action);
      return next(action);
    };
  };
};

function configureStore(initialState) {
  var reducers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var middlewares = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  var rootReducer = (0, _reduxImmutable.combineReducers)(_extends({
    global: function global(state) {
      return state || {};
    }
  }, getFakeReducersBasedOnInitialState(initialState), reducers));

  actions = [];

  var store = (0, _redux.createStore)(rootReducer, (0, _immutable.fromJS)(initialState), _redux.applyMiddleware.apply(undefined, _toConsumableArray(middlewares).concat([logger])));

  store.getActions = function () {
    return actions;
  };
  store.runSaga = function () {};
  store.asyncReducers = {};
  store.injectedReducers = {};
  store.injectedSagas = {};

  return store;
}

// backwards-compatible function name
var getStoreWithInitialState = exports.getStoreWithInitialState = configureStore;

function getFakeReducersBasedOnInitialState(initialState) {
  var fakeReducers = {};

  Object.keys(initialState).forEach(function (key) {
    fakeReducers[key] = function (state) {
      return state || (0, _immutable.fromJS)(initialState[key]);
    };
  });

  return fakeReducers;
}

function createComponentWithStore(children) {
  var initialState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var store = configureStore(initialState);
  var component = _reactTestRenderer2.default.create(_react2.default.createElement(
    _reactRedux.Provider,
    { store: store },
    children
  ));

  return { component: component, store: store };
}

function shallowWithStore(children) {
  var initialState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var store = configureStore(initialState);
  var node = _react2.default.createElement(
    _reactRedux.Provider,
    { store: store },
    children
  );

  return (0, _enzyme.shallow)(node);
}

function mountWithStore(node, initialState) {
  var store = configureStore(initialState);
  return (0, _enzyme.mount)(node, {
    context: { store: store },
    childContextTypes: { store: _propTypes2.default.object.isRequired }
  });
}