import React from 'react';
import PropTypes from 'prop-types';
import { connect, mapDispatchToProps } from 'utils';
import { Button } from 'components/bootstrap';
import { Modal } from 'components';
import { formActions, projectActions, userActions, uiActions } from 'actions';

const mapStateToProps = state => ({
  teamMember: state.editor.teamMember
});

@connect(
  mapStateToProps,
  mapDispatchToProps(userActions, uiActions, formActions, projectActions)
)
export default class MemberActionsModal extends React.PureComponent {
  static propTypes = {
    teamMember:      PropTypes.object,
    uiModal:         PropTypes.func.isRequired,
    projectMarkRead: PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   * @param {Event} e
   * @param {int} block
   */
  handleGotoClick = (e, block) => {
    const { uiModal } = this.props;

    const selector = `canvas-block-${block}`;
    // const canvasBlock = document.getElementById(selector);
    const canvasBlock = document.querySelector('.block:last-child');

    if (canvasBlock) {
      uiModal({
        modal: 'memberActions',
        open:  false
      });
      canvasBlock.scrollIntoView({ behavior: 'smooth' });
      canvasBlock.classList.add('block-highlighted');
      setTimeout(() => {
        canvasBlock.classList.remove('block-highlighted');
      }, 2000);
    }
  };

  /**
   *
   */
  handleMarkReadClick = () => {
    const { teamMember, projectMarkRead, uiModal } = this.props;

    projectMarkRead(teamMember);
    uiModal({
      modal: 'memberActions',
      open:  false
    });
  };

  /**
   * @returns {*}
   */
  renderActions = () => {
    const { teamMember } = this.props;

    if (!teamMember.actions) {
      teamMember.actions = [];
    }

    return (
      <ul className="list-group list-group-flush editor-team-actions">
        {teamMember.actions.map(action => (
          <li className="list-group-item editor-team-actions-item" key={action.id}>
            <div className="editor-team-action-heading">
              <h6 className="editor-team-action-message">
                {action.title}
              </h6>
              <div className="editor-team-action-date">
                {action.date}
              </div>
            </div>
            {action.memo && (
              <div className="editor-team-action-memo">
                Memo: {action.memo}
              </div>
            )}
            {action.block && (
              <div className="editor-team-action-buttons">
                <Button theme="link" onClick={e => this.handleGotoClick(e, action.block)} sm>
                  Go to block
                </Button>
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    const { teamMember } = this.props;

    if (!teamMember) {
      return null;
    }

    const buttons = (
      <Button onClick={this.handleMarkReadClick} sm>
        Mark Read
      </Button>
    );

    return (
      <Modal
        name="memberActions"
        buttons={buttons}
        title={teamMember.user.name}
        avatar={teamMember.user.avatar}
      >
        {this.renderActions()}
      </Modal>
    );
  }
}
