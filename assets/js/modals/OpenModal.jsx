import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect, mapDispatchToProps } from 'utils';
import { Row, Column, Modal, ModalHeader, ModalBody, ModalFooter, Button, Card, CardBody, CardFooter } from 'components/bootstrap';
import { Icon } from 'components';
import * as editorActions from 'actions/editorActions';
import * as formActions from 'actions/formActions';

const mapStateToProps = state => ({
  modals:   state.editor.modals,
  projects: state.editor.projects
});

@connect(
  mapStateToProps,
  mapDispatchToProps(editorActions, formActions)
)
export default class OpenModal extends React.PureComponent {
  static propTypes = {
    modals:              PropTypes.object.isRequired,
    editorModal:         PropTypes.func.isRequired,
    editorOpenProject:   PropTypes.func.isRequired,
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
  handleClosed = () => {
    const { editorModal } = this.props;

    this.setState({ selected: 0 });
    editorModal({
      modal: 'open',
      open:  false
    });
  };

  /**
   *
   */
  handleSelectClick = () => {
    const { editorModal, editorOpenProject } = this.props;
    const { selected } = this.state;

    this.setState({ selected: 0 });
    editorOpenProject(selected);
    editorModal({
      modal: 'open',
      open:  false
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
    const { modals } = this.props;
    const { selected } = this.state;

    return (
      <Modal open={modals.open} onClosed={this.handleClosed} lg>
        <ModalHeader>
          <Icon name="folder-open" />
          Open
        </ModalHeader>
        <ModalBody onClick={this.handleBodyClick}>
          {this.renderProjects()}
        </ModalBody>
        <ModalFooter>
          <Button onClick={this.handleSelectClick} disabled={selected === 0} sm>
            Select
          </Button>
          <Button onClick={this.handleClosed} sm>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
