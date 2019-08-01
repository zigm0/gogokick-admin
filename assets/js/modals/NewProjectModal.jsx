import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect, system, arrays, mapDispatchToProps } from 'utils';
import { Row, Column, Button, Card, CardBody, CardFooter } from 'components/bootstrap';
import {  Modal } from 'components';
import * as editorActions from 'actions/editorActions';
import * as formActions from 'actions/formActions';

const mapStateToProps = state => ({
  editor: state.editor
});

@connect(
  mapStateToProps,
  mapDispatchToProps(editorActions, formActions)
)
export default class NewProjectModal extends React.PureComponent {
  static propTypes = {
    editor:               PropTypes.object.isRequired,
    editorModal:          PropTypes.func.isRequired,
    editorNewProject:     PropTypes.func.isRequired,
    editorOpenProject:    PropTypes.func.isRequired,
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
    const { editor, editorNewProject } = this.props;
    const { selected } = this.state;

    this.setState({ selected: 0 });
    const template = arrays.findByID(editor.templates, selected);

    system.confirm('Project Name', template.name)
      .then((name) => {
        name = $.trim(name);
        if (name) {
          template.name = name;
          editorNewProject(template);
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
    const { editor } = this.props;
    const { selected } = this.state;

    return (
      <Row>
        {editor.templates.map(project => (
          <Column key={project.id} xl={3}>
            <Card
              className={classNames('card-project', { 'card-selected': selected === project.id })}
              onClick={e => this.handleCardClick(e, project)}
            >
              <CardBody>
                <div className="card-project-thumb" style={{ backgroundImage: `url(${project.screenshot})`}} />
              </CardBody>
              <CardFooter>
                {project.name}
              </CardFooter>
            </Card>
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
        lg
      >
        {this.renderProjects()}
      </Modal>
    );
  }
}
