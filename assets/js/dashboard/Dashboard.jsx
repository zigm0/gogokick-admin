import React from 'react';
import PropTypes from 'prop-types';
import { connect, mapDispatchToProps } from 'utils';
import { ProjectCard } from 'cards';
import { Container, Row, Column } from 'components/bootstrap';
import { projectActions } from 'actions';
import { Workspace } from 'components';
import Activities from './Activities';

const mapStateToProps = state => ({
  projects: state.editor.projects,
  watching: state.project.watching
});

@connect(
  mapStateToProps,
  mapDispatchToProps(projectActions)
)
export default class Dashboard extends React.PureComponent {
  static propTypes = {
    projects:    PropTypes.array.isRequired,
    watching:    PropTypes.array.isRequired,
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
  renderProjects = () => {
    const { projects } = this.props;

    return (
      <Column xl={6} className="gutter-bottom">
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
    );
  };

  /**
   * @returns {*}
   */
  renderWatching = () => {
    const { watching } = this.props;

    if (watching.length === 0) {
      return null;
    }

    return (
      <Column xl={6} className="gutter-bottom">
        <h3>Watchlist</h3>
        <Row>
          {watching.map(project => (
            <Column key={project.id}>
              <ProjectCard
                project={project}
                watching
              />
            </Column>
          ))}
        </Row>
      </Column>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    return (
      <Workspace name="dashboard" title="Dashboard">
        <Container className="editor-home" fluid>
          <Row>
            <Column xl={4}>
              <Activities />
            </Column>
            <Column xl={8}>
              <Row>
                {this.renderProjects()}
                {this.renderWatching()}
              </Row>
            </Column>
          </Row>
        </Container>
      </Workspace>
    );
  }
}
