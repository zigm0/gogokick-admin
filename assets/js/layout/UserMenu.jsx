import React from 'react';
import PropTypes from 'prop-types';
import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';
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
  handleLogoutClick = (e) => {
    const { userLogout } = this.props;

    e.preventDefault();
    userLogout();
  };

  /**
   * @returns {*}
   */
  render() {
    const { user } = this.props;

    return (
      <div className="avatar-header-menu">
        <Dropdown>
          <DropdownTrigger>
            <div className="avatar-user-menu">
              <div className="avatar-menu" data-toggle="dropdown">
                <Icon name="angle-down" />
                <Avatar src={user.avatar} />
              </div>
              <div className="avatar-menu-name">{user.name}</div>
            </div>
          </DropdownTrigger>
          <DropdownContent>
            {user.isAuthenticated ? (
              <div>
                <Link to={`/profile/${user.id}`} className="dropdown-item">
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
              <div>
                <Link to="/login" className="dropdown-item">
                  <Icon name="sign-in-alt" />
                  Login
                </Link>
                <div className="dropdown-divider" />
                <Link to="/register" className="dropdown-item">
                  <Icon name="user" />
                  Register
                </Link>
              </div>
            )}
          </DropdownContent>
        </Dropdown>
      </div>
    );
  }
}
