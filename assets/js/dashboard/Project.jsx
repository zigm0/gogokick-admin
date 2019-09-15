import React from 'react';
import PropTypes from 'prop-types';
import { connect, api, router, mapDispatchToProps } from 'utils';
import { Container, Row, Column } from 'components/bootstrap';
import { Workspace, LoadingCubes } from 'components';

const mapStateToProps = state => ({

});

@connect(
  mapStateToProps,
  mapDispatchToProps()
)
export default class Project extends React.PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired
  };

  static defaultProps = {};

  state = {
    project: null
  };

  /**
   *
   */
  componentDidMount() {
    const { match } = this.props;
    const { id } = match.params;

    api.get(router.generate('api_projects_public', { id }))
      .then((project) => {
        this.setState({ project });
      });
  }

  /**
   * @returns {*}
   */
  render() {
    const { project } = this.state;

    if (!project) {
      return <LoadingCubes />;
    }

    return (
      <Workspace name="project">
        <Container className="gutter-top margin-bottom">
          <Row>
            <Column>
              <div className="project-page">
                <h1>
                  {project.name}
                </h1>
                <p>
                  {project.subtitle}
                </p>
                <img src={project.image.url} alt="Image" />
              </div>
            </Column>
          </Row>
        </Container>
      </Workspace>
    );
  }
}
