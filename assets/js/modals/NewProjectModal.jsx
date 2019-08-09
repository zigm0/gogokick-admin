import React from 'react';
import PropTypes from 'prop-types';
import { connect, system, arrays, objects, mapDispatchToProps } from 'utils';
import { ProjectCard } from 'cards';
import { Row, Column, Button } from 'components/bootstrap';
import {  Modal } from 'components';
import * as editorActions from 'actions/editorActions';
import * as formActions from 'actions/formActions';
import * as projectActions from 'actions/projectActions';

const mapStateToProps = state => ({
  editor: state.editor
});

@connect(
  mapStateToProps,
  mapDispatchToProps(editorActions, formActions, projectActions)
)
export default class NewProjectModal extends React.PureComponent {
  static propTypes = {
    editor:               PropTypes.object.isRequired,
    editorModal:          PropTypes.func.isRequired,
    projectNew:           PropTypes.func.isRequired,
    projectOpen:          PropTypes.func.isRequired,
    editorFetchTemplates: PropTypes.func.isRequired
  };

  static defaultProps = {};

  state = {
    selected: 0
  };

  /**
   *
   */
  componentDidMount() {
    const { editorFetchTemplates } = this.props;

    editorFetchTemplates();
  }

  /**
   *
   */
  handleSelectClick = () => {
    const { editor, projectNew, editorModal } = this.props;
    const { selected } = this.state;

    const create = () => {
      this.setState({ selected: 0 });
      const template = objects.clone(arrays.findByID(editor.templates, selected));

      system.prompt('Project Name', template.name)
        .then((name) => {
          name = $.trim(name);
          if (name) {
            template.name = name;
            projectNew(template);
            editorModal({
              modal: 'newProject',
              open:  false
            });
          }
        });
    };

    if (editor.isChanged) {
      system.confirm('You have unsaved changes to the current project. Create a new project?')
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
    const { editor } = this.props;
    const { selected } = this.state;

    return (
      <Row>
        {editor.templates.map(project => (
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
      <Button onClick={this.handleSelectClick} disabled={selected === 0} sm>
        Select
      </Button>
    );

    return (
      <Modal
        name="newProject"
        title="New"
        icon="file-alt"
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
