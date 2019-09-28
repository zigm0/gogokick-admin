import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { connect, constants, strings, mapDispatchToProps } from 'utils';
import { Avatar, Icon, Link } from 'components';

const mapStateToProps = state => ({
  activities: state.activity.activities
});

@connect(
  mapStateToProps,
  mapDispatchToProps()
)
export default class Activities extends React.PureComponent {
  static propTypes = {
    activities: PropTypes.array.isRequired
  };

  static defaultProps = {};

  /**
   * @param {*} a
   *
   * @returns {*}
   */
  renderBlockNote = (a) => {
    const url = `/editor/${a.note.projectID}#block-${a.note.block.id}`;

    return (
      <>
        <span className="editor-activity-item-date">
          Commented on block <Link to={url}>#{a.note.block.id}</Link>&nbsp;
          <Moment fromNow>{a.dateCreated}</Moment>.
        </span>
        <div className="editor-activity-item-body-message hyphenate">
          <Icon name="comment-alt" className="editor-activity-item-icon" />
          {strings.truncate(a.note.text, 100)}
        </div>
      </>
    );
  };

  /**
   * @param {*} a
   *
   * @returns {*}
   */
  renderInviteAccepted = (a) => {
    return (
      <div />
    );
  };

  /**
   * @returns {*}
   */
  render() {
    const { activities } = this.props;

    return (
      <div className="editor-activities">
        <h3>Activities</h3>
        <ul>
          {activities.map(a => {
            let child = null;
            switch(constants.activityType(a.type)) {
              case 'block_note':
                child = this.renderBlockNote(a);
                break;
              case 'invite_accepted':
                child = this.renderInviteAccepted(a);
                break;
            }

            return (
              <li key={a.id} className="editor-activity-item">
                <div className="editor-activity-item-body">
                  <div className="editor-activity-item-avatar">
                    <Avatar src={a.user.avatar} sm />
                  </div>
                  <div className="editor-activity-item-body-description">
                    <span className="editor-activity-item-avatar-name">
                      {a.user.name}
                    </span>
                    {child}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
