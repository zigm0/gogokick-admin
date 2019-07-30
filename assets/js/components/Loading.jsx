import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class Loading extends React.PureComponent {
  static propTypes = {
    label:       PropTypes.string,
    white:       PropTypes.bool,
    middle:      PropTypes.bool,
    visible:     PropTypes.bool,
    strokeWidth: PropTypes.number,
    className:   PropTypes.string
  };

  static defaultProps = {
    label:       '',
    white:       false,
    middle:      false,
    visible:     true,
    strokeWidth: 4,
    className:   ''
  };

  /**
   * @returns {*}
   */
  render() {
    const { visible, label, white, middle, strokeWidth, className, ...props } = this.props;

    if (!visible) {
      return null;
    }

    const classes = classNames('loading', {
      'middle':        middle,
      'loading-white': white
    }, className);

    return (
      <div className={classes} {...props}>
        {label && (
          <span className="loading-label">
            {label}
          </span>
        )}
        <svg viewBox="25 25 50 50" className="loading-circular">
          <circle
            r="20"
            cx="50"
            cy="50"
            fill="none"
            className="loading-path"
            strokeWidth={strokeWidth}
          />
        </svg>
      </div>
    );
  }
}
