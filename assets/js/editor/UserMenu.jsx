import React from 'react';
import PropTypes from 'prop-types';
import { connect, router, mapDispatchToProps } from 'utils';
import { Avatar, Icon } from 'components';
import * as userActions from 'actions/userActions';
import * as editorActions from 'actions/editorActions';

const mapStateToProps = state => ({
  user: state.user
});

@connect(
  mapStateToProps,
  mapDispatchToProps(userActions, editorActions)
)
export default class UserMenu extends React.PureComponent {
  static propTypes = {
    user:        PropTypes.object.isRequired,
    editorModal: PropTypes.func.isRequired,
    userLogout:  PropTypes.func.isRequired
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
    const { editorModal } = this.props;

    e.preventDefault();

    editorModal({
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
   * @returns {*}
   */
  render() {
    const { user } = this.props;

    return (
      <div className="editor-header-menu">
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
            <div className="editor-header-user-menu">
              <div className="avatar-menu" data-toggle="dropdown">
                <Icon name="angle-down" />
                <Avatar src="/images/avatar-1.jpeg" sm />
              </div>
              <div>{user.name}</div>
            </div>
          </button>
          {user.isAuthenticated ? (
            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
              <a className="dropdown-item" href={router.generate('profile_index')} target="_blank">
                <Icon name="user" />
                Profile
              </a>
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
            </div>
          )}
        </div>
      </div>
    );
  }
}
