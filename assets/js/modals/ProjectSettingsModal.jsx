import React from 'react';
import PropTypes from 'prop-types';
import { connect, system, mapDispatchToProps } from 'utils';
import { Button } from 'components/bootstrap';
import { Form, Input } from 'components/forms';
import { Modal } from 'components';
import * as uiActions from 'actions/uiActions';
import * as formActions from 'actions/formActions';
import * as projectActions from 'actions/projectActions';
import * as mediaActions from 'actions/mediaActions';

const mapStateToProps = state => ({
  forms:   state.forms,
  project: state.project,
  editor:  state.editor
});

@connect(
  mapStateToProps,
  mapDispatchToProps(uiActions, formActions, projectActions, mediaActions)
)
export default class ProjectSettingsModal extends React.PureComponent {
  static propTypes = {
    forms:           PropTypes.object.isRequired,
    editor:          PropTypes.object.isRequired,
    project:         PropTypes.object.isRequired,
    uiModal:         PropTypes.func.isRequired,
    formChanges:     PropTypes.func.isRequired,
    projectSettings: PropTypes.func.isRequired,
    projectDelete:   PropTypes.func.isRequired,
    mediaUpload:     PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);

    this.file = React.createRef();
  }

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
    const { forms, uiModal, projectSettings } = this.props;

    projectSettings({
      name: forms.projectSettings.name
    });
    uiModal({
      modal: 'settings',
      open:  false
    });
  };

  /**
   *
   */
  handleDeleteClick = () => {
    const { projectDelete, uiModal } = this.props;

    system.confirm('Are you SURE you want to delete this project? This action cannot be undone.')
      .then((resp) => {
        if (resp) {
          projectDelete();
          uiModal({
            modal: 'settings',
            open:  false
          });
        }
      });
  };

  /**
   *
   */
  handleUploadClick = () => {
    this.file.current.click();
  };

  /**
   *
   */
  handleFileChange = () => {
    const { mediaUpload } = this.props;

    mediaUpload({
      file:   this.file.current.files[0],
      system: 'project_images'
    });
  };

  /**
   * @returns {*}
   */
  renderForm = () => {
    const { project } = this.props;

    let image = '/images/block-placeholder-image.png';
    if (project.image && project.image.url) {
      image = project.image.url;
    }

    return (
      <Form name="projectSettings">
        <Input
          name="name"
          type="text"
          label="Project Name"
          id="input-project-settings-name"
          sm
        />

        <div className="form-group">
          <div
            style={{ backgroundImage: `url(${image})` }}
            className="project-settings-banner"
          />
          <div>
            <Button type="button" onClick={this.handleUploadClick} sm>
              Upload
            </Button>
          </div>
        </div>
        <input
          type="file"
          accept="image/*"
          ref={this.file}
          onChange={this.handleFileChange}
          style={{ display: 'none' }}
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
