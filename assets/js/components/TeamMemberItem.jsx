import React from 'react';
import PropTypes from 'prop-types';
import { team } from 'utils';
import { strings, constants } from 'utils';
import { Avatar } from 'components';

export default class TeamMemberItem extends React.PureComponent {
  static propTypes = {
    projectUser:  PropTypes.object.isRequired,
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
    const { projectUser, onClick, onBadgeClick } = this.props;

    const actionsLength = projectUser.actions ? projectUser.actions.length : 0;
    const roles = projectUser.roles.map(r => (
      strings.ucWords(constants.projectRole(r))
    ));

    return (
      <li className="editor-team-member" onClick={e => onClick(e, projectUser)}>
        <Avatar src={projectUser.user.avatar || ''} />
        <div className="editor-team-member-info">
          <span>{projectUser.user.name}</span>
          <small>
            {roles.join(', ')}
          </small>
        </div>
        {actionsLength > 0 && (
          <span
            className="badge badge-primary"
            title={`${actionsLength} new ${strings.pluralize(actionsLength, 'action', 'actions')}`}
            onClick={e => onBadgeClick(e, projectUser)}
          >
            {actionsLength}
          </span>
        )}
      </li>
    );
  }
}
