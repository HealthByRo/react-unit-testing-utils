import React from 'react';
import {
  shallow,
  mount,
} from 'enzyme';
import {
  IntlProvider,
  intlShape,
} from 'react-intl';
import { createComponentWithStore } from './';

const intlProvider = new IntlProvider({ locale: 'en' }, {});
const { intl } = intlProvider.getChildContext();

export function shallowWithIntl(node, context = {}) {
  return shallow(nodeWithIntlProp(node), { context: { intl, ...context } });
}

export function mountWithIntl(node, context = {}) {
  return mount(nodeWithIntlProp(node), {
    context: { intl, ...context },
    childContextTypes: { intl: intlShape },
  });
}

function nodeWithIntlProp(node) {
  return React.cloneElement(node, { intl });
}

export function createComponentWithIntl(node, initialState = {}) {
  return createComponentWithStore(
    <IntlProvider locale="en">
      {node}
    </IntlProvider>
    , initialState
  );
}
