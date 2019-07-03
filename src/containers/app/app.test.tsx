import * as React from 'react';
import { shallow } from 'enzyme';
import { capitalise } from '../../utils';
import { App } from './app';

describe(capitalise(__filename.split('.')[0]), () => {
  const component = shallow(<App />);

  it('renders to the page', () => {
    expect(component.find('header').length).toBeGreaterThan(0);
    expect(component.find('main').length).toBeGreaterThan(0);
  });
})
