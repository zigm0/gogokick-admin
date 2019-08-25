import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'utils';
import { Link } from 'components';
import { Container } from 'components/bootstrap';

const mapStateToProps = state => ({
  isAuthenticated: state.user.isAuthenticated
});

@connect(
  mapStateToProps
)
export default class HomeHeader extends React.PureComponent {
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
      <header className="home-page-header">
        <Container className="d-flex align-items-center">
          <div className="home-page-header-brand">
            <Link to="/">
              <img src="/images/logo-2.png" alt="Logo" />
            </Link>
          </div>
          <div className="home-page-header-links">
            <Link to="/">
              Start a project
            </Link>
            <Link to="/about">
              About
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
          </div>
        </Container>
      </header>
    );
  }
}
