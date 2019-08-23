import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Router, withRouter } from 'react-router-dom';
import { connect, history, mapDispatchToProps } from 'utils';
import { uiActions, userActions, projectActions } from 'actions';

const EditorHome     = React.lazy(() => import('./EditorHome'));
const EditorBody     = React.lazy(() => import('./EditorBody'));
const EditorNew      = React.lazy(() => import('./EditorNew'));
const EditorSettings = React.lazy(() => import('./EditorSettings'));
const EditorProfile  = React.lazy(() => import('./EditorProfile'));

const mapStateToProps = state => ({
  project: state.project
});

@withRouter
@connect(
  mapStateToProps,
  mapDispatchToProps(projectActions, userActions, uiActions)
)
export default class EditorController extends React.PureComponent {
  static propTypes = {
    match:        PropTypes.object.isRequired,
    project:      PropTypes.object.isRequired,
    projectReset: PropTypes.func.isRequired,
    projectOpen:  PropTypes.func.isRequired,
    userMe:       PropTypes.func.isRequired,
    uiWorkspace:  PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   *
   */
  componentDidMount() {
    const { userMe } = this.props;

    userMe();
    this.handleChange({ match: { path: '' }});
  }

  /**
   * @param {*} prevProps
   */
  componentDidUpdate(prevProps) {
    this.handleChange(prevProps);
  }

  /**
   * @param {*} prevProps
   */
  handleChange = (prevProps) => {
    const { uiWorkspace, match } = this.props;
    const { match: prevMatch } = prevProps;

    if (match.path !== prevMatch.path) {
      switch (match.path) {
        case '/dashboard':
          uiWorkspace('home');
          break;
        case '/profile/:id':
          uiWorkspace('profile');
          break;
        case '/editor/:id':
          uiWorkspace('editor');
          break;
        case '/editor/new':
          uiWorkspace('new-project');
          break;
        case '/editor/:id/settings':
          uiWorkspace('project-settings');
          break;
      }
    }
  };

  /**
   * @returns {*}
   */
  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route exact path="/dashboard" component={EditorHome} />
          <Route exact path="/profile/:id" component={EditorProfile} />
          <Route exact path="/editor/new" component={EditorNew} />
          <Route exact path="/editor/:id?" component={EditorBody} />
          <Route exact path="/editor/:id/settings" component={EditorSettings} />
        </Switch>
      </Router>
    )
  }
}
