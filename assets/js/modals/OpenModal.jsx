import React from 'react';
import PropTypes from 'prop-types';
import { connect, system, history, mapDispatchToProps } from 'utils';
import { ProjectCard } from 'cards';
import { Row, Column, Button } from 'components/bootstrap';
import {  Modal } from 'components';
import * as editorActions from 'actions/editorActions';
import * as formActions from 'actions/formActions';
import * as projectActions from 'actions/projectActions';

const mapStateToProps = state => ({
  editor:   state.editor,
  projects: state.editor.projects
});

@connect(
  mapStateToProps,
  mapDispatchToProps(editorActions, formActions, projectActions)
)
export default class OpenModal extends React.PureComponent {
  static propTypes = {
    editor:              PropTypes.object.isRequired,
    projects:            PropTypes.array.isRequired,
    projectDelete:       PropTypes.func.isRequired,
    editorModal:         PropTypes.func.isRequired,
    editorFetchProjects: PropTypes.func.isRequired
  };

  static defaultProps = {};

  state = {
    selected: 0
  };

  /**
   *
   */
  componentDidMount() {
    const { editorFetchProjects } = this.props;

    editorFetchProjects();
  }

  /**
   *
   */
  handleSelectClick = () => {
    const { editor, editorModal } = this.props;
    const { selected } = this.state;

    const create = () => {
      history.push(`/editor/${selected}`);
      this.setState({ selected: 0 });
      editorModal({
        modal: 'open',
        open:  false
      });
    };

    if (editor.isChanged) {
      system.confirm('You have unsaved changes to the current project. Open a new project?')
        .then((resp) => {
          if (resp) {
            create();
          }
        });
    } else {
      create();
    }
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
            modal: 'open',
            open:  false
          });
        }
      });
  };

  /**
   * @param {Event} e
   * @param {*} project
   */
  handleCardClick = (e, project) => {
    const { selected } = this.state;

    e.stopPropagation();

    if (selected === project.id) {
      this.setState({ selected: 0 });
    } else {
      this.setState({ selected: project.id });
    }
  };

  /**
   *
   */
  handleBodyClick = () => {
    this.setState({ selected: 0 });
  };

  /**
   * @returns {*}
   */
  renderProjects = () => {
    const { projects } = this.props;
    const { selected } = this.state;

    return (
      <Row>
        {projects.map(project => (
          <Column key={project.id} xl={3}>
            <ProjectCard
              project={project}
              selected={selected === project.id}
              onClick={this.handleCardClick}
            />
          </Column>
        ))}
      </Row>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    const { selected } = this.state;

    const buttons = (
      <>
        <Button onClick={this.handleDeleteClick} disabled={selected === 0} theme="danger" sm>
          Delete
        </Button>
        <Button onClick={this.handleSelectClick} disabled={selected === 0} sm>
          Select
        </Button>
      </>
    );

    return (
      <Modal
        name="open"
        title="Open"
        icon="folder-open"
        buttons={buttons}
        onBodyClick={this.handleBodyClick}
        fixedHeight
        lg
      >
        {this.renderProjects()}
      </Modal>
    );
  }
}
