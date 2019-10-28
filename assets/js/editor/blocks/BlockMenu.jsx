import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect, constants, objects, acl, mapDispatchToProps } from 'utils';
import { Button } from 'components';
import { editorActions, uiActions, notesActions } from 'actions';

const mapStateToProps = state => ({
  meTeamMember: state.editor.meTeamMember
});

@connect(
  mapStateToProps,
  mapDispatchToProps(editorActions, uiActions, notesActions)
)
export default class BlockMenu extends React.PureComponent {
  static propTypes = {
    block: PropTypes.shape({
      id:       PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      type:     PropTypes.number.isRequired,
      isLocked: PropTypes.bool
    }).isRequired,
    buttons:             PropTypes.node,
    className:           PropTypes.string,
    meTeamMember:        PropTypes.object.isRequired,
    editorMove:          PropTypes.func.isRequired,
    editorRemove:        PropTypes.func.isRequired,
    editorActivateBlock: PropTypes.func.isRequired,
    editorBlockSettings: PropTypes.func.isRequired,
    uiModal:             PropTypes.func.isRequired,
    notesToggleVisible:  PropTypes.func.isRequired
  };

  static defaultProps = {
    buttons:   '',
    className: ''
  };

  /**
   * @param {Event} e
   */
  handleSettingsClick = (e) => {
    e.preventDefault();
    const { block, uiModal } = this.props;

    uiModal({
      modal: 'blockSettings',
      open:  true,
      meta:  block
    });
  };

  /**
   * @param {Event} e
   */
  handleDetailsClick = (e) => {
    e.preventDefault();
    const { block, uiModal } = this.props;

    uiModal({
      modal: 'blockDetails',
      open:  true,
      meta:  block
    });
  };

  /**
   *
   */
  handleRemoveClick = () => {
    const { block, editorRemove } = this.props;

    editorRemove(block);
  };

  /**
   *
   */
  handleUpClick = () => {
    const { block, editorMove } = this.props;

    editorMove({
      block,
      direction: 'up'
    });
  };

  /**
   *
   */
  handleDownClick = () => {
    const { block, editorMove } = this.props;

    editorMove({
      block,
      direction: 'down'
    });
  };

  /**
   * @param {Event} e
   */
  handleLockClick = (e) => {
    const { block, editorBlockSettings, editorActivateBlock } = this.props;

    e.preventDefault();
    e.stopPropagation();

    const newBlock = objects.clone(block);
    newBlock.isLocked = !block.isLocked;
    editorBlockSettings(newBlock);
    editorActivateBlock(0);
  };

  /**
   *
   */
  handleNotesClick = () => {
    const { block, notesToggleVisible } = this.props;

    notesToggleVisible(block.id);
  };

  /**
   * @returns {*}
   */
  render() {
    const { block, buttons, className, meTeamMember } = this.props;
    const { roles } = meTeamMember;

    const classes  = classNames(`block-menu block-menu-${constants.blockType(block.type)}`, className);
    const notesAcl = acl(roles, 'notes', 'blocks') || acl(roles, 'notes', `block-${constants.blockType(block.type)}`);

    return (
      <div className={classes}>
        <div className="block-menu-group">
          {acl(roles, 'settings', 'blocks') ? (
            <Button
              title="Settings"
              icon="cog"
              className="block-menu-item"
              onClick={this.handleSettingsClick}
            />
          ) : (
            <Button
              title="Details"
              icon="info-circle"
              className="block-menu-item"
              onClick={this.handleDetailsClick}
            />
          )}
          {acl(roles, 'drag', 'blocks') && (
            <Button
              title="Move up"
              icon="caret-up"
              className="block-menu-item"
              onClick={this.handleUpClick}
            />
          )}
          {acl(roles, 'drag', 'blocks') && (
            <Button
              title="Move down"
              icon="caret-down"
              className="block-menu-item"
              onClick={this.handleDownClick}
            />
          )}
        </div>
        <div className="block-menu-group block-menu-middle-group text-center">
          {buttons}
        </div>
        <div className="block-menu-group justify-content-end">
          {notesAcl && (
            <Button
              title="Notes"
              icon="comment-alt"
              className="block-menu-item"
              onClick={this.handleNotesClick}
            />
          )}
          {acl(roles, 'lock', 'blocks') && (
            <Button
              title={block.isLocked ? 'Unlock' : 'Lock'}
              icon={block.isLocked ? 'lock' : 'unlock'}
              className="block-menu-item"
              onClick={this.handleLockClick}
            />
          )}
          {(block.isLocked && !acl(roles, 'lock', 'blocks')) && (
            <Button
              title="Locked"
              icon="lock"
              className="block-menu-item default-cursor"
              disabled
            />
          )}
          {acl(roles, 'delete', 'blocks') && (
            <Button
              title="Delete"
              icon="times"
              className="block-menu-item"
              onClick={this.handleRemoveClick}
            />
          )}
        </div>
      </div>
    );
  }
}
