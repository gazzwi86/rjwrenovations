import * as React from 'react';
import { mount } from 'enzyme';
import { capitalise } from '../../utils';
import { SocialLinks, Links } from './social-links';

const socialLinks: Links[] = [
  {
    type: 'facebook',
    username: '',
    showText: true,
  },
  {
    type: 'twitter',
    username: '',
    showText: true,
  },
];

describe(capitalise(__filename.split('.')[0]), () => {
  const component = mount(<SocialLinks links={socialLinks} />);

  it('renders to the page', () => {
    expect(component.find('h5').first().text()).toBe('Facebook');
    expect(component.find('h5').last().text()).toBe('Twitter');
  });
})
