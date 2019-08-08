import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import { history } from 'utils';
import Editor from 'editor/Editor';

export default class App extends React.Component {
  /**
   * @returns {*}
   */
  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route exact path="/editor/:id" component={Editor} />
          <Route exact path="/editor" component={Editor} />
        </Switch>
      </Router>
    );
  }
}
