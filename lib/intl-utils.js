'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.shallowWithIntl = shallowWithIntl;
exports.mountWithIntl = mountWithIntl;
exports.createComponentWithIntl = createComponentWithIntl;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _enzyme = require('enzyme');

var _reactIntl = require('react-intl');

var _ = require('./');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var intlProvider = new _reactIntl.IntlProvider({ locale: 'en' }, {});

var _intlProvider$getChil = intlProvider.getChildContext(),
    intl = _intlProvider$getChil.intl;

function shallowWithIntl(node, context) {
  return (0, _enzyme.shallow)(nodeWithIntlProp(node), { context: _extends({ intl: intl }, context) });
}

function mountWithIntl(node, context) {
  return (0, _enzyme.mount)(nodeWithIntlProp(node), {
    context: _extends({ intl: intl }, context),
    childContextTypes: { intl: _reactIntl.intlShape }
  });
}

function nodeWithIntlProp(node) {
  return _react2.default.cloneElement(node, { intl: intl });
}

function createComponentWithIntl(children) {
  var initialState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return (0, _.createComponentWithStore)(_react2.default.createElement(
    _reactIntl.IntlProvider,
    { locale: 'en' },
    children
  ), initialState);
}