import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect, constants, objects, acl, mapDispatchToProps } from 'utils';
import { Button } from 'components';
import { editorActions, uiActions } from 'actions';

const mapStateToProps = state => ({
  meTeamMember: state.editor.meTeamMember
});

@connect(
  mapStateToProps,
  mapDispatchToProps(editorActions, uiActions)
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
   *
   */
  handleLockClick = () => {
    const { block, editorBlockSettings, editorActivateBlock } = this.props;

    const newBlock = objects.clone(block);
    newBlock.isLocked = !block.isLocked;
    editorBlockSettings(newBlock);
    editorActivateBlock(0);
  };

  /**
   * @returns {*}
   */
  render() {
    const { block, buttons, className, meTeamMember } = this.props;
    const { roles } = meTeamMember;

    const classes = classNames(`block-menu block-menu-${constants.blockType(block.type)}`, className);

    return (
      <div className={classes}>
        <div className="block-menu-group">
          {acl(roles, 'settings', 'blocks') && (
            <Button
              title="Settings"
              icon="cog"
              className="block-menu-item"
              onClick={this.handleSettingsClick}
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
