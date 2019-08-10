import React from 'react';
import PropTypes from 'prop-types';
import { Route, Router, Switch, withRouter } from 'react-router-dom';
import { connect, mapDispatchToProps } from 'utils';
import * as projectActions from 'actions/projectActions';
import EditorBody from 'editor/EditorBody';
import EditorSettings from 'editor/EditorSettings';

const mapStateToProps = state => ({
  project: state.project
});

@withRouter
@connect(
  mapStateToProps,
  mapDispatchToProps(projectActions)
)
export default class EditorController extends React.PureComponent {
  static propTypes = {
    match:       PropTypes.object.isRequired,
    project:     PropTypes.object.isRequired,
    projectOpen: PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   *
   */
  componentDidMount() {
    const { project, match, projectOpen } = this.props;

    if (!project.id) {
      projectOpen(match.params.id || 0);
    }
  }

  /**
   * @param {*} prevProps
   */
  componentDidUpdate(prevProps) {
    const { match, project, projectOpen } = this.props;

    if (!project.isSaving && match.params.id && match.params.id !== prevProps.match.params.id) {
      projectOpen(match.params.id || 0);
    }
  }

  /**
   * @returns {*}
   */
  render() {
    return (
      <Switch>
        <Route exact path="/editor/:id?" component={EditorBody} />
        <Route exact path="/editor/:id/settings" component={EditorSettings} />
      </Switch>
    )
  }
}
