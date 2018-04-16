/**
 * @module Demo/Carousel
 */
import React from 'react';
import {hot} from 'react-hot-loader';
import Carousel from 'Library';

import img1 from './img1.jpg';
import img2 from './img2.jpg';
import img3 from './img3.jpg';
import img4 from './img4.jpg';
import img5 from './img5.jpg';

@hot(module)
/**
 * Carousel page
 */
export default class Component extends React.Component {
  /**
   * Contstructor function
   * @param {Object} props
   */
  constructor(props) {
    super(props);

    this.state = {
      data: [{
        url: img1,
      }, {
        url: img2,
      }, {
        url: img3,
      }, {
        url: img4,
      }, {
        url: img5,
      }],
    };
  }

  /**
   * Render Carousel page
   * @return {Component}
   */
  render() {
    return (
      <div style={{
        position: 'fix',
        top: '0px',
        bottom: '0px',
        left: '0px',
        right: '0px',
      }}>
        <div style={{
          width: '100%',
          height: '400px',
        }}>
          <Carousel
            data={this.state.data}
            onClick={(item, index) => {
              console.log(`index: ${index} data: ${JSON.stringify(item)}`);
            }}
          />
        </div>
      </div>
    );
  }
}
