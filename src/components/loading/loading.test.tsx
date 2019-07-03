import * as React from 'react';
import { shallow } from 'enzyme';
import { capitalise } from '../../utils';
import { Loading } from './loading';

describe(capitalise(__filename.split('.')[0]), () => {
  const component = shallow(<Loading />);

  it('renders to the page', () => {
    expect(component.find('img').length).toBeGreaterThan(0);
  });
})
