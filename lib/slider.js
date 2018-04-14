import React from 'react';
import {
  object,
  array,
  number,
} from 'prop-types';
import {withStyles} from 'material-ui/styles';

const styles = (theme) => ({
  root: {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  sliderGroup: {
    position: 'relative',
    height: '100%',
  },
  sliderItem: {
    position: 'absolute',
    top: '0px',
    float: 'left',
    width: '100%',
    height: '100%',
  },
  sliderImage: {
    width: '100%',
    height: '100%',
  },
  dots: {
    position: 'absolute',
    right: '0px',
    left: '0px',
    bottom: '12px',
    textAlign: 'center',
  },
});

@withStyles(styles)
/**
 * Slider
 */
export default class Slider extends React.Component {
  static propTypes = {
    classes: object,
    data: array.isRequire,
  };

  static defaultProp = {
    data: [],
  };

  /**
   * @param  {Object} props
   */
  constructor(props) {
    super(props);

    this.dots = [];
  }

  /**
   * Init dots
   * Set silder width
   */
  componentDidMount() {
    this.initDots(this.props);

    const sliderWidth = this.slider.clientWidth;

    this.setSliderWidth(sliderWidth);
  }

  /**
   * [initDots description]
   * @param  {[type]} props [description]
   */
  initDots(props) {
    this.dots = new Array(props.data.length);
  }

  /**
   * @param {Number} sliderWidth
   */
  setSliderWidth(sliderWidth) {
    const {
      data,
    } = this.props;

    for (let i=0; i<data.length; i++) {
      this.sliderGroup.children[i].style.width = `${sliderWidth}px`;
      this.sliderGroup.children[i].style.left = `${sliderWidth * i}px`;
    }

    this.sliderGroup.style.width = `${sliderWidth * data.length}px`;
  }

  /**
   * @return {Component}
   */
  render() {
    const {
      classes,
      data,
    } = this.props;

    const sliderElement = (
      <div
        className={classes.sliderGroup}
        ref={(el) => {
          this.sliderGroup = el;
        }}
      >
        {
          data.map((item, index) => {
            return (
              <div
                className={classes.sliderItem}
                key={item.url}
              >
                <img className={classes.sliderImage} src={item.url}/>
              </div>
            );
          })
        }
      </div>
    );

    const dotsElement = (
      <div className={classes.dots}>
        {
          this.dots.map((dot, index) => {
            return <span key={index} className={classes.dot}></span>;
          })
        }
      </div>
    );

    return (
      <div
        className={classes.root}
        ref={(el) => {
          this.slider = el;
        }}
      >
        {sliderElement}
        {dotsElement}
      </div>
    );
  }
}
