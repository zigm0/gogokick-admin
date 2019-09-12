import React from 'react';
import PropTypes from 'prop-types';
import { connect, mapDispatchToProps } from 'utils';
import { ProjectCard } from 'cards';
import { Container, Row, Column } from 'components/bootstrap';
import { projectActions } from 'actions';
import { Workspace } from 'components';

const mapStateToProps = state => ({
  projects: state.editor.projects
});

@connect(
  mapStateToProps,
  mapDispatchToProps(projectActions)
)
export default class Dashboard extends React.PureComponent {
  static propTypes = {
    projects:    PropTypes.array.isRequired,
    projectOpen: PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   * @param {Event} e
   * @param {*} project
   */
  handleCardClick = (e, project) => {
    const { projectOpen } = this.props;

    projectOpen(project.id);
  };

  /**
   * @returns {*}
   */
  render() {
    const { projects } = this.props;

    return (
      <Workspace name="dashboard" title="Dashboard">
        <Container className="editor-home">
          <Row>
            <Column xl={10} offsetXl={1} className="gutter-bottom">
              <h3>My Projects</h3>
              <Row>
                {projects.map(project => (
                  <Column key={project.id}>
                    <ProjectCard
                      project={project}
                      onClick={this.handleCardClick}
                    />
                  </Column>
                ))}
              </Row>
            </Column>
          </Row>
        </Container>
      </Workspace>
    );
  }
}
