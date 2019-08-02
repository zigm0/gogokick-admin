import React from 'react';
import PropTypes from 'prop-types';
import { strings} from 'utils';
import { Avatar } from 'components';

export default class TeamMemberItem extends React.PureComponent {
  static propTypes = {
    user:         PropTypes.object.isRequired,
    onClick:      PropTypes.func,
    onBadgeClick: PropTypes.func
  };

  static defaultProps = {
    onClick: () => {}
  };

  /**
   * @returns {*}
   */
  render() {
    const { user, onClick, onBadgeClick } = this.props;

    const actionsLength = user.actions.length;

    return (
      <li className="editor-team-member" onClick={e => onClick(e, user)}>
        <Avatar src={user.avatar} sm />
        <div className="editor-team-member-info">
          <span>{user.name}</span>
          <small>{user.projectRoles.join('/')}</small>
        </div>
        {actionsLength > 0 && (
          <span
            className="badge badge-primary"
            title={`${actionsLength} new ${strings.pluralize(actionsLength, 'action', 'actions')}`}
            onClick={e => onBadgeClick(e, user)}
          >
            {actionsLength}
          </span>
        )}
      </li>
    );
  }
}
