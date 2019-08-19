import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect, mapDispatchToProps } from 'utils';
import * as projectActions from 'actions/projectActions';
import * as userActions from 'actions/userActions';
import EditorBody from 'editor/EditorBody';
import EditorNew from 'editor/EditorNew';
import EditorSettings from 'editor/EditorSettings';

const mapStateToProps = state => ({
  project: state.project
});

@withRouter
@connect(
  mapStateToProps,
  mapDispatchToProps(projectActions, userActions)
)
export default class EditorController extends React.PureComponent {
  static propTypes = {
    match:        PropTypes.object.isRequired,
    project:      PropTypes.object.isRequired,
    projectReset: PropTypes.func.isRequired,
    projectOpen:  PropTypes.func.isRequired,
    userMe:       PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   *
   */
  componentDidMount() {
    const { userMe, match } = this.props;

    userMe(match.params.id);
  }

  /**
   * @param {*} prevProps
   */
  componentDidUpdate(prevProps) {
    const { match, project, projectOpen, projectReset } = this.props;
    const { match: prevMatch } = prevProps;

    if (!match.params.id && prevMatch.params.id) {
      projectReset();
    } else if (!project.isSaving && match.params.id && match.params.id !== prevMatch.params.id) {
      projectOpen(match.params.id);
    }
  }

  /**
   * @returns {*}
   */
  render() {
    return (
      <Switch>
        <Route exact path="/editor/new" component={EditorNew} />
        <Route exact path="/editor/:id?" component={EditorBody} />
        <Route exact path="/editor/:id/settings" component={EditorSettings} />
      </Switch>
    )
  }
}
