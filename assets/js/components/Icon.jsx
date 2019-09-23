import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 *
 */
class Icon extends React.PureComponent {
  static propTypes = {
    fas:            PropTypes.bool,
    far:            PropTypes.bool,
    fab:            PropTypes.bool,
    fixed:          PropTypes.bool,
    name:           PropTypes.string.isRequired,
    size:           PropTypes.number,
    isSpinning:     PropTypes.bool,
    flipHorizontal: PropTypes.bool,
    className:      PropTypes.string
  };

  static defaultProps = {
    fas:            false,
    far:            false,
    fab:            false,
    fixed:          true,
    size:           1,
    isSpinning:     false,
    flipHorizontal: false,
    className:      ''
  };

  /**
   * @returns {*}
   */
  render() {
    const { fas, far, fab, fixed, name, size, flipHorizontal, isSpinning, className, ...props } = this.props;

    return (
      <span
        className={classNames(
          className,
          `icon fa-${size}x fa-${name}`,
          {
            'fa':                 !far && !fas && !fab,
            'fa-spin':            isSpinning,
            'fas':                fas,
            'far':                far,
            'fab':                fab,
            'fa-fw':              fixed,
            'fa-flip-horizontal': flipHorizontal
          }
        )}
        aria-hidden="true"
        {...props}
      />
    );
  }
}

export default Icon;
