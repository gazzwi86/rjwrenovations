import * as React from 'react';
import { shallow } from 'enzyme';
import { capitalise } from '../../utils';
import { Image } from './image';
import Logo from '../../assets/images/logo.jpg';

describe(capitalise(__filename.split('.')[0]), () => {
  const component = shallow(<Image source={Logo} alt="some alt" />);

  it('renders to the page', () => {
    expect(component.find('img').length).toBeGreaterThan(0);
  });
})
