import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 *
 */
class CardImage extends React.PureComponent {
  static propTypes = {
    src:       PropTypes.string.isRequired,
    className: PropTypes.string
  };

  static defaultProps = {
    className: ''
  };

  /**
   * @returns {*}
   */
  render() {
    const { src, className, ...props } = this.props;

    return (
      <img
        src={src}
        className={classNames('card-img-top', className)}
        {...props}
      />
    );
  }
}

export default CardImage;
