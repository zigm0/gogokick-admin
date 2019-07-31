import React from 'react';
import PropTypes from 'prop-types';
import { connect, mapDispatchToProps } from 'utils';
import { Modal as BootstrapModal, ModalHeader, ModalBody, ModalFooter, Button } from 'components/bootstrap';
import { Icon } from 'components';
import * as editorActions from 'actions/editorActions';

const mapStateToProps = state => ({
  modals: state.editor.modals
});

@connect(
  mapStateToProps,
  mapDispatchToProps(editorActions)
)
export default class Modal extends React.PureComponent {
  static propTypes = {
    name:        PropTypes.string.isRequired,
    icon:        PropTypes.string.isRequired,
    title:       PropTypes.string.isRequired,
    buttons:     PropTypes.node,
    lg:          PropTypes.bool,
    footer:      PropTypes.bool,
    modals:      PropTypes.object.isRequired,
    editorModal: PropTypes.func.isRequired,
    onBodyClick: PropTypes.func,
    children:    PropTypes.node
  };

  static defaultProps = {
    lg:          false,
    footer:      true,
    buttons:     '',
    children:    '',
    onBodyClick: () => {}
  };

  /**
   *
   */
  close = () => {
    const { name, editorModal } = this.props;

    editorModal({
      modal: name,
      open:  false
    });
  };

  /**
   * @returns {*}
   */
  render() {
    const { name, title, icon, buttons, footer, lg, modals, children, onBodyClick } = this.props;

    return (
      <BootstrapModal open={modals[name]} onClosed={this.close} lg={lg}>
        <ModalHeader>
          <Icon name={icon} />
          {title}
        </ModalHeader>
        <ModalBody onClick={onBodyClick}>
          {children}
        </ModalBody>
        {footer && (
          <ModalFooter>
            {buttons && React.cloneElement(buttons)}
            <Button onClick={this.close} sm>
              Cancel
            </Button>
          </ModalFooter>
        )}
      </BootstrapModal>
    );
  }
}
