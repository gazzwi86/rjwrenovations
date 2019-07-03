import * as React from 'react';
import { mount } from 'enzyme';
import { capitalise } from '../../utils';
import { Footer } from './footer';

const year = new Date().getFullYear();

describe(capitalise(__filename.split('.')[0]), () => {
  const component = mount(<Footer />);

  it('renders to the page', () => {
    expect(component.find('p').text()).toBe(`Copyright © ${year} RJW Renovations`);
  });
})
