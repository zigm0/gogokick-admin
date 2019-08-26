import React from 'react';
import PropTypes from 'prop-types';
import { connect, system, browser, history, mapDispatchToProps } from 'utils';
import { Row, Column, Button } from 'components/bootstrap';
import { Form, Input } from 'components/forms';
import { Upload, Link } from 'components';
import { formActions, projectActions, mediaActions, uiActions } from 'actions';

const mapStateToProps = state => ({
  user:    state.user,
  forms:   state.forms,
  project: state.project,
  editor:  state.editor
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
    uiModal:         PropTypes.func.isRequired,
    uiWorkspace:     PropTypes.func.isRequired,
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
    const { user, project, formChanges, uiWorkspace } = this.props;

    if (!user.isAuthenticated || !project.id) {
      history.push('/dashboard');
    } else {
      uiWorkspace('project-settings');
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

    browser.title(`${project.name} - Settings`);
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
   * @param {*} image
   */
  handleUploaded = (image) => {
    const { projectSettings } = this.props;

    projectSettings({
      image
    });
  };

  /**
   * @returns {*}
   */
  renderForm = () => {
    const { project } = this.props;

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
          <Upload
            accept="image/*"
            maxSizeMB={10}
            system="project_images"
            onUploaded={this.handleUploaded}
            cropping
          >
            <div className="project-settings-banner">
              {(project.image && project.image.url) ? (
                <img src={project.image.url} alt="banner" />
              ) : (
                <div className="project-settings-banner-instructions">
                  <div className="upload-container-top">
                    Drop an image here, or click to select a file.
                  </div>
                  <div className="upload-container-bottom">
                    It must be a JPG, PNG, GIF, TIFF or BMP. No larger than 2MB.
                  </div>
                </div>
              )}
            </div>
          </Upload>
        </div>
      </Form>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    const { project } = this.props;

    return (
      <div className="editor-settings gutter-top">
        <Row>
          <Column xl={6} offsetXl={3} className="gutter-bottom d-flex justify-content-between">
            <Link to={`/editor/${project.id}`} icon="caret-left" btn>
              Back to project
            </Link>
            <Button theme="danger" onClick={this.handleDeleteClick}>
              Delete Project
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
