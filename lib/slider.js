import React from 'react';
import {
  object,
  array,
  bool,
  number,
  func,
  oneOf,
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
  dot: {
    display: 'inline-block',
    margin: '0 4px',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'rgba(144,144,144,0.8)',
  },
  active: {
    background: '#fff',
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
    isAutoPlay: bool,
    direction: oneOf(['ltr', 'rtl']),
    interval: number,
    onClick: func,
  };

  static defaultProps = {
    data: [],
    isAutoPlay: true,
    direction: 'rtl',
    interval: 4000,
  };

  /**
   * @param  {Object} props
   */
  constructor(props) {
    super(props);

    this.dots = this.initDots(props);

    this.data = this.renderData(props.data);

    this.state = {
      translateX: 0,
      currentIndex: 0,
      time: 0,
    };
  }

  /**
   * Init dots
   * Set silder width
   */
  componentDidMount() {
    this.sliderWidth = this.slider.clientWidth;
    this.setState({
      ...this.state,
      translateX: - this.sliderWidth,
    });

    this.setSliderWidth(this.sliderWidth);

    this.setAutoPlay();
  }

  /**
   * Clear timer when the component is being removed from the DOM
   */
  componentWillUnmount() {
    this.clearAutoPlay();
  }

  /**
   * Timing to play if isAutoPlay is true
   */
  setAutoPlay() {
    const {
      isAutoPlay,
      direction,
      interval,
    } = this.props;

    if (isAutoPlay === true) {
      this.timer = setInterval(() => {
        this.moveEnd(direction);
      }, interval);
    }
  }

  /**
   * Clear autoPlay timer
   */
  clearAutoPlay() {
    if (this.props.isAutoPlay === true) {
      clearInterval(this.timer);
    }
  }

  /**
   * Init dots
   * @param  {Object} props
   * @return {Array}
   */
  initDots(props) {
    return [...new Array(props.data.length)];
  }

  /**
   * Push one element to the end of the array and the first of the array
   * @param {Array} data
   * @return {Array}
   */
  renderData(data) {
    return [data[data.length - 1]].concat(data, [data[0]]);
  }

  /**
   * @param {Number} sliderWidth
   */
  setSliderWidth(sliderWidth) {
    const {
      data,
    } = this.props;

    for (let i=0; i<data.length+2; i++) {
      this.sliderGroup.children[i].style.width = `${sliderWidth}px`;
      this.sliderGroup.children[i].style.left = `${sliderWidth * i}px`;
    }

    this.sliderGroup.style.width = `${sliderWidth * (data.length + 2)}px`;
  }

  /**
   * On touchstart callback
   * @param  {Object} e
   */
  onTouchStart(e) {
    this.clearAutoPlay();
    const touchObj = e.changedTouches[0];
    this.startX = touchObj.clientX;
  }

  /**
   * OnTouchMove callback
   * @param  {Object} e
   */
  onTouchMove(e) {
    const touchObj = e.changedTouches[0];
    this.moveX = touchObj.clientX;

    const distance = this.moveX - this.startX;

    this.setState({
      ...this.state,
      translateX: - this.sliderWidth * (this.state.currentIndex + 1) + distance,
      time: 0,
    });
  }

  /**
   * On touchEnd callback
   * @param  {Object} e
   */
  onTouchEnd(e) {
    this.setAutoPlay();
    const touchObj = e.changedTouches[0];
    this.endX = touchObj.clientX;

    const distance = this.endX - this.startX;

    if (Math.abs(distance) < this.sliderWidth / 2) {
      this.setState({
        ...this.state,
        translateX: - this.sliderWidth * (this.state.currentIndex + 1),
        time: 400,
      });
      return;
    }

    const direction = distance > 0 ? 'ltr' : 'rtl';
    this.moveEnd(direction);
  }

  /**
   * Set state after moving
   * @param {String} direction
   */
  moveEnd(direction) {
    const {
      data,
    } = this.props;

   const {
      currentIndex,
    } = this.state;

    let nextTranslateX = 0;
    let nextIndex = 0;
    let nextTime = 0;

    if (direction === 'ltr') {
      nextTranslateX = currentIndex === 0
        ? - this.sliderWidth * data.length
        : - this.sliderWidth * (currentIndex + 1) + this.sliderWidth;
      nextIndex = currentIndex === 0
        ? data.length - 1
        : currentIndex - 1;
      nextTime = currentIndex === 0
        ? 0
        : 400;
    }

    if (direction === 'rtl') {
      nextTranslateX = currentIndex === data.length - 1
        ? - this.sliderWidth * 1
        : - this.sliderWidth * (currentIndex + 1) - this.sliderWidth;
      nextIndex = currentIndex === data.length - 1
        ? 0
        : currentIndex + 1;
      nextTime = currentIndex === data.length - 1
        ? 0
        : 400;
    }

    this.setState({
      ...this.state,
      translateX: nextTranslateX,
      currentIndex: nextIndex,
      time: nextTime,
    });
  }

  /**
   * Expose onClick api
   * @param  {Object} item
   */
  onClick(item) {
    this.props.onClick && this.props.onClick(item);
  }

  /**
   * @return {Component}
   */
  render() {
    const {
      classes,
    } = this.props;

    const {
      translateX,
      currentIndex,
      time,
    } = this.state;

    const sliderElement = (() => {
      const transform = `translate3d(${translateX}px, 0, 0)`;
      const transitionDuration = `${time}ms`;
      return (
        <div
          className={classes.sliderGroup}
          ref={(el) => {
            this.sliderGroup = el;
          }}
          style={{
            transform,
            transitionDuration,
            transitionProperty: 'transform',
          }}
          onTouchStart = {this.onTouchStart.bind(this)}
          onTouchMove = {this.onTouchMove.bind(this)}
          onTouchEnd = {this.onTouchEnd.bind(this)}
        >
          {
            this.data.map((item, index) => {
              return (
                <div
                  className={classes.sliderItem}
                  key={`${index} - ${item.url}`}
                  onClick={this.onClick.bind(this, item)}
                >
                  <img className={classes.sliderImage} src={item.url}/>
                </div>
              );
            })
          }
        </div>
      );
    })();

    const dotsElement = (
      <div className={classes.dots}>
        {
          this.dots.map((dot, index) => {
            const dotClassName = index === currentIndex
              ? `${classes.dot} ${classes.active}`
              : classes.dot;
            return <span key={index} className={dotClassName}></span>;
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
