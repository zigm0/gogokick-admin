import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { objects } from 'utils';
import { Icon } from 'components';

/**
 *
 */
class ModalHeader extends React.PureComponent {
  static propTypes = {
    withCloseButton: PropTypes.bool,
    className:       PropTypes.string,
    children:        PropTypes.node,
    onButtonClick:   PropTypes.func
  };

  static defaultProps = {
    withCloseButton: true,
    className:       '',
    children:        '',
    onButtonClick:   () => {}
  };

  /**
   * @returns {*}
   */
  render() {
    const { withCloseButton, className, children, onButtonClick, ...props } = this.props;

    return (
      <div
        className={classNames('modal-header', className)}
        {...objects.keyFilter(props, ModalHeader.propTypes)}
      >
        <h5 className="modal-title">
          {children}
        </h5>
        {withCloseButton && (
          <button type="button" className="close" aria-label="Close" onClick={onButtonClick}>
            <Icon name="times" />
          </button>
        )}
      </div>
    );
  }
}

export default ModalHeader;
