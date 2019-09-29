import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect, system, browser, history, acl, mapDispatchToProps, constants } from 'utils';
import { Row, Column, Button } from 'components/bootstrap';
import { Form, Input, Textarea, Checkbox } from 'components/forms';
import { Upload, Link, Workspace } from 'components';
import { formActions, projectActions, mediaActions, uiActions } from 'actions';

const mapStateToProps = state => ({
  user:    state.user,
  forms:   state.forms,
  project: state.project,
  editor:  state.editor
});

@withRouter
@connect(
  mapStateToProps,
  mapDispatchToProps(formActions, projectActions, mediaActions, uiActions)
)
export default class EditorSettings extends React.PureComponent {
  static propTypes = {
    user:            PropTypes.object.isRequired,
    match:           PropTypes.object.isRequired,
    forms:           PropTypes.object.isRequired,
    editor:          PropTypes.object.isRequired,
    project:         PropTypes.object.isRequired,
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
    const { match, editor, project, projectOpen } = this.props;
    const { meTeamMember } = editor;

    if (meTeamMember.user && !acl(meTeamMember.roles, 'settings', 'project')) {
      history.push('/');
    }

    if (!project.id) {
      projectOpen(match.params.id, {
        redirectAfterOpen: false
      });
    } else {
      this.handleUpdate();
    }
  }

  /**
   * @param {*} prevProps
   */
  componentDidUpdate(prevProps) {
    const { project, editor } = this.props;
    const { meTeamMember } = editor;

    if (meTeamMember.user && !acl(meTeamMember.roles, 'settings', 'project')) {
      history.push('/');
    }

    browser.title(`${project.name} - Settings`);
    if (prevProps.project.name !== project.name) {
      this.handleUpdate();
    }
  }

  /**
   *
   */
  handleUpdate = () => {
    const { project, formChanges } = this.props;

    formChanges('projectSettings', {
      name:            project.name,
      subtitle:        project.subtitle  || '',
      isPublic:        project.isPublic || false,
      socialTwitter:   project.social.twitter || '',
      socialYoutube:   project.social.youtube || '',
      socialFacebook:  project.social.facebook || '',
      socialInstagram: project.social.instagram || ''
    });
  };

  /**
   *
   */
  handleDeleteClick = () => {
    const { project, projectDelete, uiModal } = this.props;

    system.confirm('Are you SURE you want to delete this project? This action cannot be undone.')
      .then((resp) => {
        if (resp) {
          projectDelete(project.id);
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
   * @param {Event} e
   */
  handleSubmit = (e) => {
    const { project, forms, projectSettings } = this.props;

    e.preventDefault();
    if (project.id) {
      projectSettings({
        name:     forms.projectSettings.name,
        subtitle: forms.projectSettings.subtitle,
        isPublic: forms.projectSettings.isPublic,
        social:   {
          twitter:   forms.projectSettings.socialTwitter,
          youtube:   forms.projectSettings.socialYoutube,
          facebook:  forms.projectSettings.socialFacebook,
          instagram: forms.projectSettings.socialInstagram
        }
      });
      history.push(`/editor/${project.id}`);
    }
  };

  /**
   * @returns {*}
   */
  renderForm = () => {
    const { project } = this.props;
    const { campaignType } = project;

    const campaignName   = constants.campaignType(campaignType);
    const indiegogo      = constants.campaignType('indiegogo');
    const kickstarter    = constants.campaignType('kickstarter');
    const maxLengthTitle = (campaignType === indiegogo) ? 50 : 60;
    const maxLengthDesc  = (campaignType === indiegogo) ? 100 : 135;
    const cropOptions    = {
      width:  (campaignType === indiegogo) ? 640 : 1024,
      height: (campaignType === indiegogo) ? 640 : 576
    };

    return (
      <Form name="projectSettings" className="gutter-bottom" onSubmit={this.handleSubmit}>
        <Input
          name="name"
          type="text"
          label="Project Title"
          id="input-project-settings-name"
          maxLength={maxLengthTitle}
          counter
          sm
        />
        {(campaignType === indiegogo) ? (
          <Textarea
            name="subtitle"
            id="input-project-settings-sub-title"
            label="Project Subtitle"
            formGroupClassName="form-group-label-lg"
            maxLength={maxLengthDesc}
            counter
          />
        ) : (
          <Input
            name="subtitle"
            id="input-project-settings-sub-title"
            label="Project Subtitle"
            formGroupClassName="form-group-label-lg"
            maxLength={maxLengthDesc}
            counter
          />
        )}
        <div className="form-group">
          <label>Project Image</label>
          <Upload
            accept="image/*"
            maxSizeMB={10}
            system="project_images"
            onUploaded={this.handleUploaded}
            cropOptions={cropOptions}
            className={
              `border-grey margin-bottom project-settings-banner project-settings-banner-${campaignName}`
            }
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
        <Checkbox
          name="isPublic"
          label="Public"
          className="margin-bottom"
          id="project-settings-is-public-input"
        />
        <Input
          type="url"
          name="socialTwitter"
          id="input-profile-social-twitter"
          label="Twitter"
          placeholder="https://"
        />
        <Input
          type="url"
          name="socialYoutube"
          id="input-profile-social-youtube"
          label="Youtube"
          placeholder="https://"
        />
        <Input
          type="url"
          name="socialFacebook"
          id="input-profile-social-facebook"
          label="Facebook"
          placeholder="https://"
        />
        <Input
          type="url"
          name="socialInstagram"
          id="input-profile-social-instagram"
          label="Instagram"
          placeholder="https://"
        />
        <Button theme="success" block>
          Save
        </Button>
      </Form>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    const { project } = this.props;

    return (
      <Workspace name="project-settings">
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
      </Workspace>
    );
  }
}
