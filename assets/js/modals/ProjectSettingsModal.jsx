import React from 'react';
import PropTypes from 'prop-types';
import { connect, mapDispatchToProps } from 'utils';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'components/bootstrap';
import { Form, Input } from 'components/forms';
import { Icon } from 'components';
import * as editorActions from 'actions/editorActions';
import * as formActions from 'actions/formActions';

const mapStateToProps = state => ({
  modals: state.editor.modals,
  editor: state.editor
});

@connect(
  mapStateToProps,
  mapDispatchToProps(editorActions, formActions)
)
export default class ProjectSettingsModal extends React.PureComponent {
  static propTypes = {
    modals:      PropTypes.object.isRequired,
    editor:      PropTypes.object.isRequired,
    editorModal: PropTypes.func.isRequired,
    formChanges: PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   *
   */
  componentDidMount() {
    const { editor, formChanges } = this.props;

    formChanges('projectSettings', {
      name: editor.projectName
    });
  }

  /**
   * @param {*} prevProps
   */
  componentDidUpdate(prevProps) {
    const { editor, formChanges } = this.props;

    if (prevProps.editor.projectName !== editor.projectName) {
      formChanges('projectSettings', {
        name: editor.projectName
      });
    }
  }

  /**
   *
   */
  handleClosed = () => {
    const { editorModal } = this.props;

    editorModal({
      modal: 'settings',
      open:  false
    });
  };

  /**
   * @returns {*}
   */
  renderForm = () => {
    return (
      <Form name="projectSettings">
        <Input
          name="name"
          type="text"
          label="Project Name"
          id="input-project-settings-name"
          sm
        />
      </Form>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    const { modals } = this.props;

    return (
      <Modal open={modals.settings} onClosed={this.handleClosed}>
        <ModalHeader>
          <Icon name="cog" />
          Settings
        </ModalHeader>
        <ModalBody>
          {this.renderForm()}
        </ModalBody>
        <ModalFooter>
          <Button onClick={this.handleClosed} sm>
            Save
          </Button>
          <Button onClick={this.handleClosed} sm>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
