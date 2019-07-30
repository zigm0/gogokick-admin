import React from 'react';
import PropTypes from 'prop-types';
import { connect, mapDispatchToProps } from 'utils';
import { Avatar, Icon } from 'components';

const mapStateToProps = state => ({

});

@connect(
  mapStateToProps,
  mapDispatchToProps()
)
export default class UserMenu extends React.PureComponent {
  static propTypes = {};

  static defaultProps = {};

  /**
   * @returns {*}
   */
  render() {
    return (
      <div className="editor-header-menu">
        <div className="btn-group">
          <button
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
                <Avatar src="https://i.pravatar.cc/36?img=8" sm />
              </div>
              <div>Scott K.</div>
            </div>
          </button>
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
        </div>
      </div>
    );
  }
}
