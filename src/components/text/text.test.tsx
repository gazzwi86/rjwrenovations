import * as React from 'react';
import { shallow } from 'enzyme';
import { capitalise } from '../../utils';
import { Text } from './text';

describe(capitalise(__filename.split('.')[0]), () => {
  const component = shallow(<Text variation="p">Some text</Text>);

  it('renders to the page', () => {
    expect(component.contains('Some text')).toBeTruthy();
  });
})
