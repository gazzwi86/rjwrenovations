import * as React from 'react';
import { shallow } from 'enzyme';
import { capitalise } from '../../utils';
import { SocialLink } from './social-link';

describe(capitalise(__filename.split('.')[0]), () => {
  it('renders to the page', () => {
    const component = shallow(<SocialLink type="facebook" showText username="gazzwi86" />);
    expect(component.find('img').length).toBeGreaterThan(0);
    expect(component.contains('Facebook')).toBeTruthy();
  });
  
  it('renders to the page without text', () => {
    const component = shallow(<SocialLink type="facebook" username="gazzwi86" />);
    expect(component.find('img').length).toBeGreaterThan(0);
    expect(component.find('h5').length).toBe(0);
  });
})
