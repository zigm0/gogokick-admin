import React from 'react';
import PropTypes from 'prop-types';
import { connect, system, history, mapDispatchToProps } from 'utils';
import { Container, Row, Column, Button } from 'components/bootstrap';
import { Form, Input } from 'components/forms';
import * as editorActions from 'actions/editorActions';
import * as formActions from 'actions/formActions';
import * as projectActions from 'actions/projectActions';
import * as mediaActions from 'actions/mediaActions';
import ProjectImage from './settings/ProjectImage';

const mapStateToProps = state => ({
  forms:   state.forms,
  project: state.project,
  editor:  state.editor
});

@connect(
  mapStateToProps,
  mapDispatchToProps(editorActions, formActions, projectActions, mediaActions)
)
export default class EditorSettings extends React.PureComponent {
  static propTypes = {
    forms:           PropTypes.object.isRequired,
    editor:          PropTypes.object.isRequired,
    project:         PropTypes.object.isRequired,
    editorModal:     PropTypes.func.isRequired,
    formChanges:     PropTypes.func.isRequired,
    projectOpen:     PropTypes.func.isRequired,
    projectSettings: PropTypes.func.isRequired,
    projectDelete:   PropTypes.func.isRequired,
    mediaUpload:     PropTypes.func.isRequired
  };

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
   * @param {Event} e
   */
  handleUpdateClick = (e) => {
    e.preventDefault();
    const { forms, editorModal, projectSettings } = this.props;

    projectSettings({
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
   *
   */
  handleCloseClick = () => {
    const { project } = this.props;

    history.push(`/editor/${project.id}`);
  };

  /**
   * @returns {*}
   */
  renderForm = () => {
    const { project, mediaUpload } = this.props;

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
          <ProjectImage project={project} mediaUpload={mediaUpload} />
        </div>
        <div className="text-right">
          <Button theme="success" onClick={this.handleUpdateClick}>
            Update
          </Button>
        </div>
      </Form>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    return (
      <Container className="gutter-top">
        <Row>
          <Column xs={8} offsetXl={2} className="gutter-bottom">
            <Button icon="caret-left" onClick={this.handleCloseClick}>
              Back to project
            </Button>
          </Column>
        </Row>
        <Row>
          <Column xs={8} offsetXl={2}>
            {this.renderForm()}
          </Column>
        </Row>
      </Container>
    );
  }
}
