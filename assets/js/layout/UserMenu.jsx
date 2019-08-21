import React from 'react';
import PropTypes from 'prop-types';
import { connect, mapDispatchToProps } from 'utils';
import { Avatar, Icon, Link } from 'components';
import { userActions, uiActions } from 'actions';

const mapStateToProps = state => ({
  user: state.user
});

@connect(
  mapStateToProps,
  mapDispatchToProps(userActions, uiActions)
)
export default class UserMenu extends React.PureComponent {
  static propTypes = {
    user:       PropTypes.object.isRequired,
    uiModal:    PropTypes.func.isRequired,
    userLogout: PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);

    this.menu = React.createRef();
  }

  /**
   *
   */
  componentDidUpdate() {
    $(this.menu.current).dropdown();
  }

  /**
   * @param {Event} e
   */
  handleLoginClick = (e) => {
    const { uiModal } = this.props;

    e.preventDefault();

    uiModal({
      modal: 'login',
      open:  true
    });
  };

  /**
   * @param {Event} e
   */
  handleLogoutClick = (e) => {
    const { userLogout } = this.props;

    e.preventDefault();
    userLogout();
  };

  /**
   * @param {Event} e
   */
  handleRegisterClick = (e) => {
    const { uiModal } = this.props;

    e.preventDefault();

    uiModal({
      modal: 'register',
      open:  true
    });
  };

  /**
   * @returns {*}
   */
  render() {
    const { user } = this.props;

    return (
      <div className="avatar-header-menu">
        <div className="btn-group">
          <button
            ref={this.menu}
            className="btn"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <div className="avatar-user-menu">
              <div className="avatar-menu" data-toggle="dropdown">
                <Icon name="angle-down" />
                <Avatar src={user.avatar} sm />
              </div>
              <div>{user.name}</div>
            </div>
          </button>
          {user.isAuthenticated ? (
            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
              <Link to="/editor/profile" className="dropdown-item">
                <Icon name="user" />
                Profile
              </Link>
              <div className="dropdown-divider" />
              <a className="dropdown-item" href="#" onClick={this.handleLogoutClick}>
                <Icon name="sign-out-alt" />
                Logout
              </a>
            </div>
          ) : (
            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
              <a className="dropdown-item" href="#" onClick={this.handleLoginClick}>
                <Icon name="sign-in-alt" />
                Login
              </a>
              <a className="dropdown-item" href="#" onClick={this.handleRegisterClick}>
                <Icon name="user" />
                Register
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }
}
