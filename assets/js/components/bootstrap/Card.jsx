import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 *
 */
class Card extends React.PureComponent {
  static propTypes = {
    name:      PropTypes.string,
    primary:   PropTypes.bool,
    fullWidth: PropTypes.bool,
    className: PropTypes.string,
    children:  PropTypes.node
  };

  static defaultProps = {
    name:      '',
    primary:   false,
    fullWidth: false,
    className: '',
    children:  ''
  };

  /**
   * @returns {*}
   */
  render() {
    const { name, primary, fullWidth, className, children, ...props } = this.props;

    const classes = classNames({
      'card':         true,
      'card-primary': primary,
      'full-width':   fullWidth
    }, className);

    return (
      <div className={classes} {...props}>
        {children}
      </div>
    );
  }
}

export default Card;
