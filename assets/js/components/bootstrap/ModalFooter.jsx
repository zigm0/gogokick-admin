import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 *
 */
class ModalFooter extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    children:  PropTypes.node
  };

  static defaultProps = {
    className: '',
    children:  ''
  };

  /**
   * @returns {*}
   */
  render() {
    const { className, children, ...props } = this.props;

    return (
      <div className={classNames('modal-footer', className)} {...props}>
        {children}
      </div>
    );
  }
}

export default ModalFooter;
