import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect, constants, mapDispatchToProps } from 'utils';
import { Button } from 'components';
import { editorActions, uiActions } from 'actions';

const mapStateToProps = state => ({

});

@connect(
  mapStateToProps,
  mapDispatchToProps(editorActions, uiActions)
)
export default class Menu extends React.PureComponent {
  static propTypes = {
    block: PropTypes.shape({
      id:   PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      type: PropTypes.number.isRequired
    }).isRequired,
    buttons:      PropTypes.node,
    className:    PropTypes.string,
    editorMove:   PropTypes.func.isRequired,
    editorRemove: PropTypes.func.isRequired,
    uiModal:      PropTypes.func.isRequired,
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
   * @returns {*}
   */
  render() {
    const { block, buttons, className } = this.props;

    const classes = classNames(`block-menu block-menu-${constants.blockType(block.type)}`, className);

    return (
      <div className={classes}>
        <div className="block-menu-group">
          <Button
            title="Settings"
            icon="cog"
            className="block-menu-item"
            onClick={this.handleSettingsClick}
          />
          <Button
            title="Move up"
            icon="caret-up"
            className="block-menu-item"
            onClick={this.handleUpClick}
          />
          <Button
            title="Move down"
            icon="caret-down"
            className="block-menu-item"
            onClick={this.handleDownClick}
          />
        </div>
        <div className="block-menu-group block-menu-middle-group text-center">
          {buttons}
        </div>
        <div className="block-menu-group justify-content-end">
          <Button
            title="Delete"
            icon="times"
            className="block-menu-item"
            onClick={this.handleRemoveClick}
          />
        </div>
      </div>
    );
  }
}
