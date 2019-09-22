import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { connect, mapDispatchToProps } from 'utils';
import { Avatar, Icon } from 'components';

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
   * @returns {*}
   */
  render() {
    const { activities } = this.props;

    return (
      <div className="editor-activities">
        <h3>Activities</h3>
        <ul>
          {activities.map(a => (
            <li key={a.id} className="editor-activity-item">
              <div className="editor-activity-item-avatar">
                <Avatar src={a.user.avatar} sm />
                <div>
                  <div className="editor-activity-item-avatar-name">
                    {a.user.name}
                  </div>
                  <Moment fromNow>{a.dateCreated}</Moment>
                </div>
              </div>
              <div className="editor-activity-item-body">
                <div className="editor-activity-item-body-description">
                  <Icon name="comment-alt" className="editor-activity-item-icon" />
                  <span>
                    Commented on block <a href="#">#{a.note.block.id}</a>.
                  </span>
                </div>
                <div className="editor-activity-item-body-message">
                  {a.note.text}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
