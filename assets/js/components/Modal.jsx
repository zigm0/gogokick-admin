import React from 'react';
import PropTypes from 'prop-types';
import { connect, mapDispatchToProps } from 'utils';
import { Modal as BootstrapModal, ModalHeader, ModalBody, ModalFooter, Button } from 'components/bootstrap';
import { Icon, Avatar, ErrorBoundary } from 'components';
import * as editorActions from 'actions/editorActions';
import * as uiActions from 'actions/uiActions';

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
    title:       PropTypes.string.isRequired,
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
    onClosed:    () => {},
    onBodyClick: () => {}
  };

  /**
   *
   */
  close = () => {
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
    const { name, title, icon, avatar, role, buttons, fixedHeight, closeText, footer, id, lg, modals, children, onBodyClick } = this.props;

    return (
      <BootstrapModal open={modals[name]} onClosed={this.close} role={role} lg={lg} id={id}>
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
            {buttons && React.cloneElement(buttons)}
            <Button onClick={this.close} sm>
              {closeText}
            </Button>
          </ModalFooter>
        )}
      </BootstrapModal>
    );
  }
}
