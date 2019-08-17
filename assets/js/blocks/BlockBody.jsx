import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect, constants, mapDispatchToProps } from 'utils';
import BlockEditorText from './BlockEditorText';
import BlockEditorImage from './BlockEditorImage';
import BlockEditorVideo from './BlockEditorVideo';

const mapStateToProps = state => ({

});

@connect(
  mapStateToProps,
  mapDispatchToProps()
)
export default class BlockBody extends React.PureComponent {
  static propTypes = {
    block: PropTypes.shape({
      text: PropTypes.string,
      type: PropTypes.number.isRequired
    }).isRequired,
    isActive:     PropTypes.bool.isRequired,
    isHover:      PropTypes.bool.isRequired,
    editorChange: PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   * @returns {*}
   */
  render() {
    const { block, isActive, isHover } = this.props;

    if (isActive) {
      switch (block.type) {
        case 1:
          return <BlockEditorText block={block} />;
        case 2:
          return <BlockEditorImage block={block} />;
        case 3:
          return <BlockEditorVideo block={block} />;
        default:
          console.error(`Invalid block type ${block.type}`);
          return null;
      }
    }

    const isEmpty  = block.text === '';
    const classes  = classNames(`block block-${constants.blockType(block.type)}`, {
      'block-empty':  isEmpty && !isActive,
      'block-active': isActive,
      'block-hover':  isHover
    });

    return (
      <div className={classes}>
        {isEmpty && (
          <h2 className="block-description">
            {block.description || 'Description'}
          </h2>
        )}
        {!isEmpty && (
          block.text
        )}
      </div>
    );
  }
}
