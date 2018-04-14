/**
 * @module Demo/Slider
 */
import React from 'react';
import {hot} from 'react-hot-loader';
import Slider from 'Library';

import img1 from './img1.jpg';
import img2 from './img2.jpg';
import img3 from './img3.jpg';

@hot(module)
/**
 * Slider page
 */
export default class Component extends React.Component {
  /**
   * Contstructor function
   * @param {Object} props
   */
  constructor(props) {
    super(props);

    this.data = [{
      url: img1,
    }, {
      url: img2,
    }, {
      url: img3,
    }];
  }

  /**
   * Render slider page
   * @return {Component}
   */
  render() {
    return (
      <div style={{width: '100vw', height: '400px'}}>
        <Slider data={this.data}>
        </Slider>
      </div>
    );
  }
}
