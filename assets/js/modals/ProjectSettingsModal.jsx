import React from 'react';
import PropTypes from 'prop-types';
import { connect, system, mapDispatchToProps } from 'utils';
import { Button } from 'components/bootstrap';
import { Form, Input } from 'components/forms';
import { Modal } from 'components';
import * as editorActions from 'actions/editorActions';
import * as formActions from 'actions/formActions';

const mapStateToProps = state => ({
  forms:  state.forms,
  editor: state.editor
});

@connect(
  mapStateToProps,
  mapDispatchToProps(editorActions, formActions)
)
export default class ProjectSettingsModal extends React.PureComponent {
  static propTypes = {
    forms:               PropTypes.object.isRequired,
    editor:              PropTypes.object.isRequired,
    editorModal:         PropTypes.func.isRequired,
    formChanges:         PropTypes.func.isRequired,
    editorUpdateProject: PropTypes.func.isRequired,
    editorDeleteProject: PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   *
   */
  componentDidMount() {
    const { editor, formChanges } = this.props;

    formChanges('projectSettings', {
      projectName: editor.projectName
    });
  }

  /**
   * @param {*} prevProps
   */
  componentDidUpdate(prevProps) {
    const { editor, formChanges } = this.props;

    if (prevProps.editor.projectName !== editor.projectName) {
      formChanges('projectSettings', {
        projectName: editor.projectName
      });
    }
  }

  /**
   *
   */
  handleSaveClick = () => {
    const { forms, editorModal, editorUpdateProject } = this.props;

    editorUpdateProject({
      projectName: forms.projectSettings.projectName
    });
    editorModal({
      modal: 'settings',
      open:  false
    });
  };

  /**
   *
   */
  handleDeleteClick = () => {
    const { editorDeleteProject, editorModal } = this.props;

    system.confirm('Are you SURE you want to delete this project? This action cannot be undone.')
      .then((resp) => {
        if (resp) {
          editorDeleteProject();
          editorModal({
            modal: 'settings',
            open:  false
          });
        }
      });
  };

  /**
   * @returns {*}
   */
  renderForm = () => {
    return (
      <Form name="projectSettings">
        <Input
          name="projectName"
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
    const buttons = (
      <>
        <Button className="modal-delete-btn" theme="danger" onClick={this.handleDeleteClick} sm>
          Delete Project
        </Button>
        <Button onClick={this.handleSaveClick} sm>
          Save
        </Button>
      </>
    );

    return (
      <Modal
        name="settings"
        title="Settings"
        icon="cog"
        buttons={buttons}
      >
        {this.renderForm()}
      </Modal>
    );
  }
}
