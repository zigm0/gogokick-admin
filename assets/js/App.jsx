import React from 'react';
import PropTypes from 'prop-types';
import { Route, Router, Switch } from 'react-router-dom';
import { connect, history, mapDispatchToProps } from 'utils';
import { Loading } from 'components';
import Editor from 'editor/Editor';
import * as userActions from "./actions/userActions";
import * as editorActions from 'actions/editorActions';
import * as projectActions from 'actions/projectActions';

const mapStateToProps = state => ({
  projectIsBusy: state.project.isBusy,
  editorIsBusy:  state.editor.isBusy,
  userIsBusy:    state.user.isBusy
});

@connect(
  mapStateToProps,
  mapDispatchToProps(userActions, editorActions, projectActions)
)
export default class App extends React.Component {
  static propTypes = {
    userIsBusy:    PropTypes.bool.isRequired,
    projectIsBusy: PropTypes.bool.isRequired,
    editorIsBusy:  PropTypes.bool.isRequired
  };

  /**
   *
   */
  componentDidMount() {
    const { userMe } = this.props;

    userMe();
  }

  /**
   * @returns {*}
   */
  render() {
    const { userIsBusy, editorIsBusy, projectIsBusy } = this.props;

    return (
      <>
        <Router history={history}>
          <Switch>
            <Route exact path="/editor/:id?" component={Editor} />
          </Switch>
        </Router>
        {(userIsBusy || editorIsBusy || projectIsBusy) && (
          <Loading middle />
        )}
      </>
    );
  }
}
