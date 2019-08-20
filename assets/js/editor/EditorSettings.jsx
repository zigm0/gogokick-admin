import React from 'react';
import PropTypes from 'prop-types';
import { connect, system, history, mapDispatchToProps } from 'utils';
import { Row, Column, Button } from 'components/bootstrap';
import { Form, Input } from 'components/forms';
import { ImageUpload } from 'components';
import * as formActions from 'actions/formActions';
import * as projectActions from 'actions/projectActions';
import * as mediaActions from 'actions/mediaActions';
import * as uiActions from 'actions/uiActions';

const mapStateToProps = state => ({
  user:        state.user,
  forms:       state.forms,
  project:     state.project,
  editor:      state.editor,
  isUploading: state.media.isUploading
});

@connect(
  mapStateToProps,
  mapDispatchToProps(formActions, projectActions, mediaActions, uiActions)
)
export default class EditorSettings extends React.PureComponent {
  static propTypes = {
    user:            PropTypes.object.isRequired,
    forms:           PropTypes.object.isRequired,
    editor:          PropTypes.object.isRequired,
    project:         PropTypes.object.isRequired,
    isUploading:     PropTypes.bool.isRequired,
    uiModal:         PropTypes.func.isRequired,
    formChanges:     PropTypes.func.isRequired,
    projectOpen:     PropTypes.func.isRequired,
    projectSettings: PropTypes.func.isRequired,
    projectDelete:   PropTypes.func.isRequired,
    mediaCrop:       PropTypes.func.isRequired,
    mediaUpload:     PropTypes.func.isRequired
  };

  /**
   *
   */
  componentDidMount() {
    const { user, project, formChanges } = this.props;

    if (!user.isAuthenticated || !project.id) {
      history.push('/editor');
    } else {
      formChanges('projectSettings', {
        name: project.name
      });
    }
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
  componentWillUnmount() {
    const { project, forms, projectSettings } = this.props;

    if (project.id) {
      projectSettings({
        name: forms.projectSettings.name
      });
    }
  }

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
  handleCloseClick = () => {
    const { project } = this.props;

    history.push(`/editor/${project.id}`);
  };

  /**
   * @param {File} file
   */
  handleUpload = (file) => {
    const { project, mediaUpload, mediaCrop, projectSettings } = this.props;

    mediaUpload({
      file,
      project,
      system:     'project_images',
      onComplete: (media) => {
        mediaCrop({
          media,
          onComplete: (image) => {
            projectSettings({
              image
            });
          }
        });
      }
    });
  };

  /**
   * @returns {*}
   */
  renderForm = () => {
    const { project, isUploading } = this.props;

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
          <label>Project Image</label>
          <ImageUpload
            media={project.image}
            onDrop={this.handleUpload}
            isUploading={isUploading}
            className="project-settings-banner"
          />
        </div>
      </Form>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    return (
      <div className="editor-settings gutter-top">
        <Row>
          <Column xl={6} offsetXl={3} className="gutter-bottom">
            <Button icon="caret-left" onClick={this.handleCloseClick}>
              Back to project
            </Button>
          </Column>
        </Row>
        <Row>
          <Column xl={6} offsetXl={3}>
            {this.renderForm()}
          </Column>
        </Row>
      </div>
    );
  }
}
