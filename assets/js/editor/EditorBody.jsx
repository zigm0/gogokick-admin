import React from 'react';
import PropTypes from 'prop-types';
import { connect, browser, mapDispatchToProps } from 'utils';
import Canvas from 'editor/Canvas';
import * as projectActions from 'actions/projectActions';
import * as userActions from 'actions/userActions';

const mapStateToProps = state => ({
  project: state.project
});

@connect(
  mapStateToProps,
  mapDispatchToProps(projectActions, userActions)
)
export default class EditorBody extends React.PureComponent {
  static propTypes = {
    match:       PropTypes.object.isRequired,
    project:     PropTypes.object.isRequired,
    projectOpen: PropTypes.func.isRequired,
  };

  /**
   *
   */
  componentDidMount() {
    const { match, project, projectOpen } = this.props;

    const matchId = parseInt(match.params.id, 10);
    if (!isNaN(matchId) && project.id !== matchId) {
      projectOpen(matchId);
    }
  }

  /**
   *
   */
  componentDidUpdate() {
    const { project } = this.props;

    browser.title(project.name);
  }

  /**
   * @returns {*}
   */
  render() {
    return (
      <Canvas />
    );
  }
}
