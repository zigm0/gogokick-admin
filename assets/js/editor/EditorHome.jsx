import React from 'react';
import PropTypes from 'prop-types';
import { connect, history, mapDispatchToProps } from 'utils';
import { ProjectCard } from 'cards';
import { Container, Row, Column } from 'components/bootstrap';
import * as projectActions from 'actions/projectActions';

const mapStateToProps = state => ({
  projects: state.editor.projects
});

@connect(
  mapStateToProps,
  mapDispatchToProps(projectActions)
)
export default class EditorHome extends React.PureComponent {
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
      <Container className="editor-home">
        <Row>
          <Column xl={8} offsetXl={2} className="gutter-bottom">
            <Row>
              {projects.map(project => (
                <Column key={project.id} xl={6} md={12}>
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
    );
  }
}
