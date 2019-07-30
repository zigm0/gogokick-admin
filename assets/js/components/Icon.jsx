import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 *
 */
class Icon extends React.PureComponent {
  static propTypes = {
    fas:        PropTypes.bool,
    far:        PropTypes.bool,
    fixed:      PropTypes.bool,
    name:       PropTypes.string.isRequired,
    size:       PropTypes.number,
    isSpinning: PropTypes.bool,
    className:  PropTypes.string
  };

  static defaultProps = {
    fas:        false,
    far:        false,
    fixed:      true,
    size:       1,
    isSpinning: false,
    className:  ''
  };

  /**
   * @returns {*}
   */
  render() {
    const { fas, far, fixed, name, size, isSpinning, className, ...props } = this.props;

    return (
      <span
        className={classNames(
          className,
          `icon fa-${size}x fa-${name}`,
          {
            'fa':      !far && !fas,
            'fa-spin': isSpinning,
            'fas':     fas,
            'far':     far,
            'fa-fw':   fixed
          }
        )}
        aria-hidden="true"
        {...props}
      />
    );
  }
}

export default Icon;
