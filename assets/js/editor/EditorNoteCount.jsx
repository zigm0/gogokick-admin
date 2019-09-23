import React from 'react';
import PropTypes from 'prop-types';
import { connect, arrays } from 'utils';
import { Icon } from 'components';

const EditorNoteCount = ({ canvasBlocks, blockIndex, activeBlockID }) => {
  if (!activeBlockID) {
    return <div className="editor-note-count" />;
  }

  const block = arrays.findByID(canvasBlocks[blockIndex], activeBlockID);

  return (
    <div className="editor-note-count editor-note-count-visible">
      <Icon name="comment-alt" size={2} flipHorizontal />
      <div className="editor-note-count-value">
        {block.noteCount}
      </div>
    </div>
  )
};

EditorNoteCount.propTypes = {
  activeBlockID: PropTypes.number.isRequired,
  blockIndex:    PropTypes.number.isRequired,
  canvasBlocks:  PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  canvasBlocks:  state.editor.canvasBlocks,
  blockIndex:    state.editor.blockIndex,
  activeBlockID: state.editor.activeBlockID
});

export default connect(mapStateToProps)(EditorNoteCount);
