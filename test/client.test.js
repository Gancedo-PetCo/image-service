import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Gallery from '../react-client/src/Gallery.jsx';

Enzyme.configure({ adapter: new Adapter() });

describe('Gallery', () => {
  let testImages = [ '4323gsfg-526424', '624452fsa-gewa553'];

  it('should render the main image', () => {
    const wrapper = shallow(<Gallery itemImages={testImages} />);
    const expectedString = `https://images.unsplash.com/photo-4323gsfg-526424?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0`;
    expect(wrapper.find('img.galleryMainImage').prop('src')).toEqual(expectedString);
  });

  it('should render small images', () => {
    const wrapper = shallow(<Gallery itemImages={testImages} />);
    expect(wrapper.find('img.gallerySmallImage')).toHaveLength(2);
  });

  it('should render the large image', () => {
    const wrapper = shallow(<Gallery itemImages={testImages} />);
    wrapper.find('img.galleryMainImage').simulate('mouseEnter', {nativeEvent: {offsetX: 10, offsetY: 20}});
    expect(wrapper.state('preview')).toBe(true);
  });


});
