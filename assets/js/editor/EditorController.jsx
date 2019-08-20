import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect, mapDispatchToProps } from 'utils';
import * as projectActions from 'actions/projectActions';
import * as userActions from 'actions/userActions';
import * as uiActions from 'actions/uiActions';
import EditorHome from 'editor/EditorHome';
import EditorBody from 'editor/EditorBody';
import EditorNew from 'editor/EditorNew';
import EditorSettings from 'editor/EditorSettings';
import EditorProfile from 'editor/EditorProfile';

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
        case '/editor':
          uiWorkspace('home');
          break;
        case '/editor/profile':
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
      <Switch>
        <Route exact path="/editor" component={EditorHome} />
        <Route exact path="/editor/profile" component={EditorProfile} />
        <Route exact path="/editor/new" component={EditorNew} />
        <Route exact path="/editor/:id?" component={EditorBody} />
        <Route exact path="/editor/:id/settings" component={EditorSettings} />
      </Switch>
    )
  }
}
