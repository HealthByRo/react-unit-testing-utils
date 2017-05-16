'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findActionByType = findActionByType;
exports.getStoreWithInitialState = getStoreWithInitialState;
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

var _reduxMockStore = require('redux-mock-store');

var _reduxMockStore2 = _interopRequireDefault(_reduxMockStore);

var _reactTestRenderer = require('react-test-renderer');

var _reactTestRenderer2 = _interopRequireDefault(_reactTestRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function findActionByType(store, actionType) {
  return store.getActions().find(function (action) {
    return action.type === actionType;
  });
}

function getStoreWithInitialState(initialState) {
  var middlewares = [];
  var mockStore = (0, _reduxMockStore2.default)(middlewares);
  return mockStore((0, _immutable.fromJS)(initialState));
}

function createComponentWithStore(children) {
  var initialState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var store = getStoreWithInitialState(initialState);
  var component = _reactTestRenderer2.default.create(_react2.default.createElement(
    _reactRedux.Provider,
    { store: store },
    children
  ));

  return { component: component, store: store };
}

function shallowWithStore(node, initialState) {
  var store = getStoreWithInitialState(initialState);
  return (0, _enzyme.shallow)(node, { context: { store: store } });
}

function mountWithStore(node, initialState) {
  var store = getStoreWithInitialState(initialState);
  return (0, _enzyme.mount)(node, {
    context: { store: store },
    childContextTypes: { store: _propTypes2.default.object.isRequired }
  });
}

function nodeWithStoreProp(node, store) {
  return _react2.default.cloneElement(node);
}