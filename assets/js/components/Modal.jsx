import React from 'react';
import PropTypes from 'prop-types';
import { connect, mapDispatchToProps } from 'utils';
import { Modal as BootstrapModal, ModalHeader, ModalBody, ModalFooter, Button } from 'components/bootstrap';
import { Icon, Avatar } from 'components';
import { editorActions, uiActions } from 'actions';

const mapStateToProps = state => ({
  modals: state.ui.modals
});

@connect(
  mapStateToProps,
  mapDispatchToProps(editorActions, uiActions)
)
export default class Modal extends React.PureComponent {
  static propTypes = {
    name:        PropTypes.string.isRequired,
    title:       PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    icon:        PropTypes.string,
    avatar:      PropTypes.string,
    buttons:     PropTypes.node,
    lg:          PropTypes.bool,
    id:          PropTypes.string,
    role:        PropTypes.string,
    closeText:   PropTypes.string,
    footer:      PropTypes.bool,
    fixedHeight: PropTypes.bool,
    modals:      PropTypes.object.isRequired,
    uiModal:     PropTypes.func.isRequired,
    onBodyClick: PropTypes.func,
    onOpened:    PropTypes.func,
    onClosed:    PropTypes.func,
    children:    PropTypes.node
  };

  static defaultProps = {
    lg:          false,
    footer:      true,
    fixedHeight: false,
    id:          '',
    icon:        '',
    avatar:      '',
    role:        'dialog',
    closeText:   'Close',
    buttons:     '',
    children:    '',
    onOpened:    () => {},
    onClosed:    () => {},
    onBodyClick: () => {}
  };

  /**
   *
   */
  close = (e) => {
    const { name, uiModal, onClosed } = this.props;

    onClosed();
    uiModal({
      modal: name,
      open:  false
    });
  };

  /**
   * @returns {*}
   */
  render() {
    const {
      name,
      title,
      icon,
      avatar,
      role,
      buttons,
      fixedHeight,
      closeText,
      footer,
      id,
      lg,
      modals,
      onOpened,
      children,
      onBodyClick
    } = this.props;

    return (
      <BootstrapModal open={modals[name]} onOpened={onOpened} onClosed={this.close} role={role} lg={lg} id={id}>
        <ModalHeader>
          {icon && (
            <Icon name={icon} />
          )}
          {avatar && (
            <Avatar src={avatar} sm />
          )}
          {title}
        </ModalHeader>
        <ModalBody className={fixedHeight ? 'modal-body-fixed-height' : ''} onClick={onBodyClick}>
          {children}
        </ModalBody>
        {footer && (
          <ModalFooter>
            {buttons}
            <Button onClick={this.close}>
              {closeText}
            </Button>
          </ModalFooter>
        )}
      </BootstrapModal>
    );
  }
}
