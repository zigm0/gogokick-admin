import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'utils';

const mapStateToProps = state => ({
  isAuthenticated: state.user.isAuthenticated
});

@connect(
  mapStateToProps
)
export default class ProtectedRoute extends React.PureComponent {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    component:       PropTypes.object.isRequired
  };

  /**
   * @returns {*}
   */
  render() {
    const { isAuthenticated, component: Component, ...rest } = this.props;

    return (
      <Route {...rest} render={(props) => (
        isAuthenticated === true
          ? <Component {...props} />
          : <Redirect to='/login' />
      )} />
    );
  }
}
