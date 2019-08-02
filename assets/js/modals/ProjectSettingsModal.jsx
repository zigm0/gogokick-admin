import React from 'react';
import PropTypes from 'prop-types';
import { connect, system, mapDispatchToProps } from 'utils';
import { Button } from 'components/bootstrap';
import { Form, Input } from 'components/forms';
import { Modal } from 'components';
import * as editorActions from 'actions/editorActions';
import * as formActions from 'actions/formActions';
import * as projectActions from 'actions/projectActions';

const mapStateToProps = state => ({
  forms:   state.forms,
  project: state.project,
  editor:  state.editor
});

@connect(
  mapStateToProps,
  mapDispatchToProps(editorActions, formActions, projectActions)
)
export default class ProjectSettingsModal extends React.PureComponent {
  static propTypes = {
    forms:         PropTypes.object.isRequired,
    editor:        PropTypes.object.isRequired,
    project:       PropTypes.object.isRequired,
    editorModal:   PropTypes.func.isRequired,
    formChanges:   PropTypes.func.isRequired,
    projectUpdate: PropTypes.func.isRequired,
    projectDelete: PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   *
   */
  componentDidMount() {
    const { project, formChanges } = this.props;

    formChanges('projectSettings', {
      name: project.name
    });
  }

  /**
   * @param {*} prevProps
   */
  componentDidUpdate(prevProps) {
    const { project, formChanges } = this.props;

    if (prevProps.project.name !== project.name) {
      formChanges('projectSettings', {
        name: project.name
      });
    }
  }

  /**
   *
   */
  handleSaveClick = () => {
    const { forms, editorModal, projectUpdate } = this.props;

    projectUpdate({
      name: forms.projectSettings.name
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
    const { projectDelete, editorModal } = this.props;

    system.confirm('Are you SURE you want to delete this project? This action cannot be undone.')
      .then((resp) => {
        if (resp) {
          projectDelete();
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
