import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { objects } from 'utils';

/**
 *
 */
class ModalBody extends React.PureComponent {
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
      <div
        className={classNames('modal-body', className)}
        {...objects.keyFilter(props, ModalBody.propTypes)}
      >
        {children}
      </div>
    );
  }
}

export default ModalBody;
