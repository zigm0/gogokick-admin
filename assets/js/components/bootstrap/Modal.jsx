import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { objects, browser } from 'utils';
import { ModalContent, ModalBody, ModalHeader, ModalFooter } from 'components/bootstrap';

const { $ } = window;

/**
 *
 */
class Modal extends React.PureComponent {
  static propTypes = {
    sm:              PropTypes.bool,
    lg:              PropTypes.bool,
    open:            PropTypes.bool,
    fade:            PropTypes.bool,
    closeable:       PropTypes.bool,
    centered:        PropTypes.bool,
    backdrop:        PropTypes.bool,
    withCloseButton: PropTypes.bool,
    title:           PropTypes.string,
    className:       PropTypes.string,
    children:        PropTypes.node,
    onOpened:        PropTypes.func,
    onClosed:        PropTypes.func
  };

  static defaultProps = {
    sm:              false,
    lg:              false,
    open:            false,
    fade:            true,
    closeable:       true,
    centered:        true,
    backdrop:        true,
    withCloseButton: true,
    title:           '',
    className:       '',
    children:        '',
    onOpened:        () => {},
    onClosed:        () => {}
  };

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.opened   = false;
    this.modalRef = React.createRef();
    this.modalDOM = null;
  }

  /**
   * Called after the component mounts
   */
  componentDidMount() {
    const { open } = this.props;

    this.modalDOM = $(this.modalRef.current);
    this.modalDOM.on('shown.bs.modal', this.handleModalShown);
    this.modalDOM.on('hidden.bs.modal', this.handleModalHidden);
    if (open) {
      this.open();
    }
  }

  /**
   * Called after the component updates
   */
  componentDidUpdate() {
    const { open } = this.props;

    if (this.opened !== open) {
      this.toggle(open);
    }
  }

  /**
   * Called before the component unmounts
   */
  componentWillUnmount() {
    $('.modal-backdrop').remove();
    browser.showScrollbars();

    this.modalDOM.off('shown.bs.modal', this.handleModalShown);
    this.modalDOM.off('hidden.bs.modal', this.handleModalHidden);
  }

  /**
   * @param {boolean} open
   */
  toggle = (open) => {
    if (open === undefined) {
      open = !this.opened;
    }
    if (open) {
      this.open();
    } else {
      this.close();
    }
  };

  /**
   *
   */
  open = () => {
    const { onOpened } = this.props;

    this.modalDOM.modal('show');
    this.opened = true;
    onOpened();
  };

  /**
   *
   */
  close = () => {
    const { closeable, onClosed } = this.props;

    if (closeable) {
      this.modalDOM.modal('hide');
      this.opened = false;
      onClosed();
    }
  };

  /**
   *
   */
  handleModalShown = () => {
    const { onOpened } = this.props;

    this.opened = true;
    onOpened();
  };

  /**
   *
   */
  handleModalHidden = () => {
    const { onClosed } = this.props;

    this.opened = false;
    onClosed();
  };

  /**
   *
   */
  handleCloseClick = () => {
    this.close();
  };

  /**
   *
   */
  handleDialogClick = (e) => {
    if (e.target.getAttribute('role') === 'dialog') {
      this.close();
    }
  };

  /**
   * @returns {*}
   */
  render() {
    const { sm, lg, centered, backdrop, title, fade, withCloseButton, className, children, ...props } = this.props;

    let body               = null;
    let header             = null;
    let footer             = null;
    const childArray       = React.Children.toArray(children);
    const childrenFiltered = childArray.filter((child) => {
      if (child.type === ModalHeader) {
        header = React.cloneElement(child, {
          onButtonClick: this.handleCloseClick
        });
        return false;
      }
      if (child.type === ModalBody) {
        body = child;
        return false;
      }
      if (child.type === ModalFooter) {
        footer = child;
        return false;
      }
      return true;
    });

    if (!header && title && withCloseButton) {
      header = (
        <ModalHeader onButtonClick={this.handleCloseClick} withCloseButton={withCloseButton}>
          {title}
        </ModalHeader>
      );
    }
    if (!body) {
      body = (
        <ModalBody>
          {childrenFiltered}
        </ModalBody>
      );
    }

    let dataBackdrop = 'static';
    if (!backdrop) {
      dataBackdrop = false;
    }

    const dialogClasses = classNames('modal', className, {
      'fade': fade
    });
    const modalClasses = classNames('modal-dialog', {
      'modal-sm':              sm,
      'modal-lg':              lg,
      'modal-dialog-centered': centered
    });

    return (
      <div /* eslint-disable-line */
        tabIndex="-1"
        role="dialog"
        ref={this.modalRef}
        className={dialogClasses}
        data-backdrop={dataBackdrop}
        {...objects.keyFilter(props, Modal.propTypes)}
        onClick={this.handleDialogClick}
      >
        <div className={modalClasses} role="document">
          <ModalContent>
            {header}
            {body}
            {footer}
          </ModalContent>
        </div>
      </div>
    );
  }
}

export default Modal;
