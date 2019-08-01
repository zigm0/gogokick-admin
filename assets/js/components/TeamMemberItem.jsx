import React from 'react';
import PropTypes from 'prop-types';
import { Avatar } from 'components';

export default class TeamMemberItem extends React.PureComponent {
  static propTypes = {
    user:    PropTypes.object.isRequired,
    onClick: PropTypes.func
  };

  static defaultProps = {
    onClick: () => {}
  };

  /**
   * @returns {*}
   */
  render() {
    const { user, onClick } = this.props;

    return (
      <li className="editor-sidebar-team-member" onClick={e => onClick(e, user)}>
        <Avatar src={user.avatar} sm />
        <div className="editor-sidebar-team-member-info">
          <span>{user.name}</span>
          <small>{user.role}</small>
        </div>
      </li>
    );
  }
}
