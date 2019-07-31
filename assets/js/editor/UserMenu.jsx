import React from 'react';
import PropTypes from 'prop-types';
import { connect, mapDispatchToProps } from 'utils';
import { Avatar, Icon } from 'components';

const mapStateToProps = state => ({
  user: state.user
});

@connect(
  mapStateToProps,
  mapDispatchToProps()
)
export default class UserMenu extends React.PureComponent {
  static propTypes = {
    user: PropTypes.object.isRequired
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
              <a className="dropdown-item" href="#">
                <Icon name="user" />
                Profile
              </a>
              <div className="dropdown-divider" />
              <a className="dropdown-item" href="#">
                <Icon name="sign-out-alt" />
                Logout
              </a>
            </div>
          ) : (
            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
              <a className="dropdown-item" href="#">
                <Icon name="sign-out-alt" />
                Login
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }
}
