import React from 'react';
import PropTypes from 'prop-types';
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
    editorFetchProjects: PropTypes.func.isRequired
  };

  static defaultProps = {};

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

    editorModal({
      modal: 'open',
      open:  false
    });
  };

  /**
   *
   */
  handleSelectClick = () => {

  };

  /**
   * @returns {*}
   */
  renderProjects = () => {
    const { projects } = this.props;

    return (
      <Row>
        {projects.map(project => (
          <Column key={project.id} xl={3}>
            <Card className="card-project">
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

    return (
      <Modal open={modals.open} onClosed={this.handleClosed} lg>
        <ModalHeader>
          <Icon name="folder-open" />
          Open
        </ModalHeader>
        <ModalBody>
          {this.renderProjects()}
        </ModalBody>
        <ModalFooter>
          <Button onClick={this.handleSelectClick} sm>
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
