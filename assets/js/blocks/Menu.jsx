import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect, constants, mapDispatchToProps } from 'utils';
import { Button } from 'components';
import * as editorActions from 'actions/editorActions';

const mapStateToProps = state => ({

});

@connect(
  mapStateToProps,
  mapDispatchToProps(editorActions)
)
export default class Menu extends React.PureComponent {
  static propTypes = {
    block: PropTypes.shape({
      id:   PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      type: PropTypes.number.isRequired
    }).isRequired,
    buttons:      PropTypes.node,
    className:    PropTypes.string,
    editorRemove: PropTypes.func.isRequired,
    editorModal:  PropTypes.func.isRequired,
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
    const { block, editorModal } = this.props;

    editorModal({
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
   * @returns {*}
   */
  render() {
    const { block, buttons, className } = this.props;

    const classes = classNames(`block-menu block-menu-${constants.blockType(block.type)}`, className);

    return (
      <div className={classes}>
        <div className="flex-grow-1">
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
          />
          <Button
            title="Move down"
            icon="caret-down"
            className="block-menu-item"
          />
        </div>
        <div className="flex-grow-1">
          {buttons}
        </div>
        <div className="flex-grow-1 text-right">
          <Button
            title="Delete"
            icon="times"
            className="block-menu-item block-menu-item-remove"
            onClick={this.handleRemoveClick}
          />
        </div>
      </div>
    );
  }
}
