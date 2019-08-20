import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 *
 */
export default class Avatar extends React.PureComponent {
  static propTypes = {
    src: PropTypes.string.isRequired,
    sm:  PropTypes.bool,
    lg:  PropTypes.bool
  };

  static defaultProps = {
    sm: false,
    lg: false
  };

  /**
   * @returns {*}
   */
  render() {
    const { src, sm, lg, ...props } = this.props;

    const classes = classNames('avatar', {
      'avatar-sm': sm,
      'avatar-lg': lg
    });

    return (
      <span className={classes} {...props}>
        <img src={src} alt="Avatar" />
      </span>
    );
  }
}
