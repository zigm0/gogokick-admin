import React from 'react';
import PropTypes from 'prop-types';
import { connect, mapDispatchToProps } from 'utils';
import { Link } from 'components';
import { Container } from 'components/bootstrap';
import UserMenu from 'layout/UserMenu';
import { editorActions, projectActions, uiActions } from 'actions';

const mapStateToProps = state => ({
  isAuthenticated: state.user.isAuthenticated
});

@connect(
  mapStateToProps,
  mapDispatchToProps(editorActions, projectActions, uiActions)
)
export default class DashboardHeader extends React.PureComponent {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired
  };

  static defaultProps = {};

  /**
   * @returns {*}
   */
  render() {
    const { isAuthenticated } = this.props;

    return (
      <header className="editor-header dashboard-header">
        <Container className="d-flex align-items-center">
          <div className="editor-header-left">
            <Link to="/">
              <img src="/images/logo-2.png" alt="Logo" />
            </Link>
          </div>
          <div className="editor-header-middle home-page-header-links">
            <Link to="/editor/new">
              Start a project
            </Link>
            {isAuthenticated ? (
              <Link to="/dashboard">
                Dashboard
              </Link>
            ) : (
              <Link to="/">
                Login
              </Link>
            )}
            <Link to="/help">
              Help
            </Link>
          </div>
          <div className="editor-header-right">
            <UserMenu />
          </div>
        </Container>
      </header>
    );
  }
}
