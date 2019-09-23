import React from 'react';
import PropTypes from 'prop-types';
import { connect, arrays, mapDispatchToProps } from 'utils';
import { Icon } from 'components';
import { notesActions } from 'actions';

const EditorNoteCount = ({ canvasBlocks, blockIndex, activeBlockID, notesToggleVisible }) => {
  if (!activeBlockID) {
    return <div className="editor-note-count" />;
  }

  const block = arrays.findByID(canvasBlocks[blockIndex], activeBlockID);
  if (!block) {
    return <div className="editor-note-count" />;
  }

  return (
    <div className="editor-note-count editor-note-count-visible" onClick={() => notesToggleVisible(block.id)}>
      <Icon name="comment-alt" size={2} flipHorizontal />
      <div className="editor-note-count-value">
        {block.noteCount}
      </div>
    </div>
  );
};

EditorNoteCount.propTypes = {
  activeBlockID:      PropTypes.number.isRequired,
  blockIndex:         PropTypes.number.isRequired,
  canvasBlocks:       PropTypes.array.isRequired,
  notesToggleVisible: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  canvasBlocks:  state.editor.canvasBlocks,
  blockIndex:    state.editor.blockIndex,
  activeBlockID: state.editor.activeBlockID
});

export default connect(mapStateToProps, mapDispatchToProps(notesActions))(EditorNoteCount);
