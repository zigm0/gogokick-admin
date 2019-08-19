import React from 'react';
import PropTypes from 'prop-types';
import { connect, mapDispatchToProps } from 'utils';
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
    match:        PropTypes.object.isRequired,
    project:      PropTypes.object.isRequired,
    projectReset: PropTypes.func.isRequired,
    projectOpen:  PropTypes.func.isRequired,
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
   * @param {*} prevProps
   */
  componentDidUpdate(prevProps) {
    const { match, projectOpen, projectReset } = this.props;
    const { match: prevMatch } = prevProps;

    if (match.params.id !== prevMatch.params.id) {
      if (!match.params.id) {
        projectReset();
      } else {
        projectOpen(match.params.id);
      }
    }
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
