import React from 'react';
import {
  object,
  string,
  bool,
  number,
  func,
  oneOf,
  arrayOf,
  shape,
} from 'prop-types';
import {withStyles} from 'material-ui/styles';
import isShallowEqual from '../Util/IsShallowEqual';

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
    width: '12px',
    height: '12px',
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
    data: arrayOf(shape({
      url: string.isRequire,
    })).isRequire,
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

    this.isNeedReset = false;
    this.data = this.renderData(props.data);

    this.state = {
      data: [...props.data],
      sliderWidth: 0,
      translateX: 0,
      currentIndex: 0,
      time: 0,
    };
  }

  /**
   * Set silder width
   */
  componentDidMount() {
    this.sliderWidth = this.slider.clientWidth;
    this.setState({
      ...this.state,
      sliderWidth: this.sliderWidth,
      translateX: - this.sliderWidth,
    });

    this.setAutoPlay();
  }

  /**
   * Clear timer when the component is being removed from the DOM
   */
  componentWillUnmount() {
    this.clearAutoPlay();
  }

  /**
   * Init state once data is updated
   * @param  {Object} nextProps
   * @param  {Object} prevState
   * @return {Object|Null}
   */
  static getDerivedStateFromProps(nextProps, prevState) {
    if (!isShallowEqual(nextProps.data, prevState.data)) {
      return {
        ...prevState,
        data: [...nextProps.data],
        translateX: - prevState.sliderWidth,
        currentIndex: 0,
        time: 0,
      };
    }
    return null;
  }

  /**
   * Reinitialize data once data is updated
   * @param  {Object} nextProps
   * @param  {Object} nextState
   * @return {Boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    if (!isShallowEqual(this.props.data, nextProps.data)) {
      this.data = this.renderData(nextProps.data);
    }
    return true;
  }

  /**
   * Set state after updating occurs
   * Reset state need 390ms at least because of render dom need 10ms and transitionDuration is 400ms
   * @param  {Object} prevProps
   * @param  {Object} prevState
   * @param  {Object} snapshot - It returns the getSnapshotBeforeUpdate() lifecycle
   */
  componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      data,
    } = prevProps;

   const {
      currentIndex,
    } = prevState;

    if (this.isNeedReset === false) {
      return;
    }

    setTimeout(() => {
      const direction = (this.endX - this.startX) > 0 ? 'ltr' : 'rtl';
      this.isNeedReset = false;

      if (currentIndex === 0 && direction === 'ltr') {
        this.setState({
          ...this.state,
          translateX: - this.sliderWidth * data.length,
          time: 0,
        });
      }

      if (currentIndex === data.length - 1 && direction === 'rtl') {
        this.setState({
          ...this.state,
          translateX: - this.sliderWidth,
          time: 0,
        });
      }
    }, 390);
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
   * Push one element to the end of the array and the first of the array
   * @param {Array} data
   * @return {Array}
   */
  renderData(data) {
    return [data[data.length - 1]].concat(data, [data[0]]);
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

    if (Math.abs(distance) < this.sliderWidth / 5) {
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

    if ((currentIndex === 0 && direction === 'ltr')
      || (currentIndex === data.length - 1 && direction === 'rtl')
    ) {
      this.isNeedReset = true;
    }

    this.setState({
      ...this.state,
      translateX: direction === 'ltr'
        ? - this.sliderWidth * (currentIndex + 1) + this.sliderWidth
        : - this.sliderWidth * (currentIndex + 1) - this.sliderWidth,
      currentIndex: direction === 'ltr'
        ? (currentIndex === 0 ? data.length - 1 : currentIndex - 1)
        : (currentIndex === data.length - 1 ? 0 : currentIndex + 1),
      time: 400,
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
      data,
    } = this.props;

    const {
      sliderWidth,
      translateX,
      currentIndex,
      time,
    } = this.state;

    const sliderElement = (() => {
      const width = `${sliderWidth * this.data.length}px`;
      const transform = `translate3d(${translateX}px, 0, 0)`;
      const transitionDuration = `${time}ms`;

      return (
        <div
          className={classes.sliderGroup}
          style={{
            width,
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
              const left = `${sliderWidth * index}px`;
              const width = `${sliderWidth}px`;

              return (
                <div
                  className={classes.sliderItem}
                  key={`${index} - ${item.url}`}
                  onClick={this.onClick.bind(this, item)}
                  style={{
                    left,
                    width,
                  }}
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
          data.map((item, index) => {
            const dotClassName = index === currentIndex
              ? `${classes.dot} ${classes.active}`
              : classes.dot;
            return <span key={item.url} className={dotClassName}></span>;
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
