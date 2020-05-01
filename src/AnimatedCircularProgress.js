import React from 'react';
import PropTypes from 'prop-types';
import { Animated, Easing } from 'react-native';
import CircularProgress from './CircularProgress';
const AnimatedProgress = Animated.createAnimatedComponent(CircularProgress);

export default class AnimatedCircularProgress extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fillAnimation: new Animated.Value(props.prefill),
      rotationAnimation: new Animated.Value(props.rotation),
    };
  }

  componentDidMount() {
    this.animate();
    this.animateRotation();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.fill !== this.props.fill) {
      this.animate();
    }
  }

  reAnimate(prefill, toVal, dur, ease) {
    this.setState(
      {
        fillAnimation: new Animated.Value(prefill),
      },
      () => this.animate(toVal, dur, ease)
    );
  }

  animate(toVal, dur, ease) {
    const toValue = toVal >= 0 ? toVal : this.props.fill;
    const duration = dur || this.props.duration;
    const easing = ease || this.props.easing;
    const useNativeDriver = this.props.useNativeDriver;

    const anim = Animated.timing(this.state.fillAnimation, {
      useNativeDriver,
      toValue,
      easing,
      duration,
    });
    anim.start(this.props.onAnimationComplete);

    return anim;
  }

  animateColor() {
    if (!this.props.tintColorSecondary) {
      return this.props.tintColor;
    }

    const tintAnimation = this.state.fillAnimation.interpolate({
      inputRange: [0, 100],
      outputRange: [this.props.tintColor, this.props.tintColorSecondary],
    });

    return tintAnimation;
  }

  animateRotation() {
    if (!this.props.rotationDuration) {
      return this.props.rotation;
    }

    const toValue = this.props.rotation + 360;
    const duration = this.props.rotationDuration;
    const easing = this.props.rotationEasing;
    const useNativeDriver = this.props.useNativeDriver;

    const anim = Animated.loop(
      Animated.timing(this.state.rotationAnimation, {
        useNativeDriver,
        toValue,
        easing,
        duration,
      })
    );
    anim.start();

    return anim;
  }

  render() {
    const { fill, prefill, ...other } = this.props;

    return (
      <AnimatedProgress
        {...other}
        fill={this.state.fillAnimation}
        rotation={this.state.rotationAnimation}
        tintColor={this.animateColor()}
      />
    );
  }
}

AnimatedCircularProgress.propTypes = {
  ...CircularProgress.propTypes,
  prefill: PropTypes.number,
  duration: PropTypes.number,
  easing: PropTypes.func,
  onAnimationComplete: PropTypes.func,
  useNativeDriver: PropTypes.bool,
};

AnimatedCircularProgress.defaultProps = {
  duration: 500,
  easing: Easing.out(Easing.ease),
  rotationEasing: Easing.inOut(Easing.ease),
  prefill: 0,
  useNativeDriver: false,
};
