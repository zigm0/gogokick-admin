import { objects, constants, arrays } from 'utils';
import * as types from 'actions/editorActions';
import { EDITOR_BLOCK_MEDIA } from "actions/editorActions";

const initialState = objects.merge({
  isBusy:        false,
  isChanged:     false,
  isSidebarOpen: true,
  projects:      [],
  teamMember:    null,
  blockIndex:    0,
  activeBlockID: 0,
  hoverBlockID:  0,
  canvasBlocks:  [[]],
  modalMeta:     null,
  modalCallback: () => {},
  modals:        {
    login:         false,
    preview:       false,
    cropper:       false,
    confirm:       false,
    settings:      false,
    register:      false,
    teamMember:    false,
    addMember:     false,
    memberActions: false,
    blockSettings: false
  },
  sidebarBlocks: [
    {
      id:          1,
      type:        'text',
      text:        '',
      caption:     '',
      description: '',
      media:       null,
      isHeadline:  false
    },
    {
      id:          2,
      type:        'image',
      text:        '',
      caption:     '',
      description: '',
      media:       null,
      isHeadline:  false
    },
    {
      id:          3,
      type:        'video',
      text:        '',
      caption:     '',
      description: '',
      media:       null,
      isHeadline:  false
    }
  ]
}, window.initialState.editor);

let idIndex = 9;

/**
 * Remove formatting from text when pasted into the content editable
 * regions
 * @see https://stackoverflow.com/a/34876744/401019
 */
$(document).on('paste', '[contenteditable]', (e) => {
  e.preventDefault();

  let text = '';
  if (e.clipboardData || e.originalEvent.clipboardData) {
    text = (e.originalEvent || e).clipboardData.getData('text/plain');
  } else if (window.clipboardData) {
    text = window.clipboardData.getData('Text');
  }

  if (document.queryCommandSupported('insertText')) {
    document.execCommand('insertText', false, text);
  } else {
    document.execCommand('paste', false, text);
  }
});

// @see https://stackoverflow.com/a/35634418/401019
document.execCommand('defaultParagraphSeparator', false, 'p');

const reorder = (list, startIndex, endIndex) => {
  const result    = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone   = Array.from(destination);
  const sourceBlock = objects.clone(source[droppableSource.index]);
  sourceClone.splice(droppableSource.index, 1);

  sourceBlock.id   = `n-${idIndex}`;
  sourceBlock.type = constants.blockType(sourceBlock.type);
  idIndex += 1;

  destClone.splice(droppableDestination.index, 0, sourceBlock);

  return destClone;
};

/**
 * @returns {*}
 */
const onEditorReset = (state) => {
  const { isSidebarOpen } = state;

  const newState = objects.clone(initialState);
  newState.isSidebarOpen = isSidebarOpen;

  return newState;
};

/**
 * @param {*} state
 * @returns {*}
 */
const onEditorUndo = (state) => {
  let { blockIndex } = state;

  if (blockIndex > 0) {
    blockIndex -= 1;
  }

  return {
    ...state,
    blockIndex
  };
};

/**
 * @param {*} state
 * @returns {*}
 */
const onEditorRedo = (state) => {
  const { canvasBlocks } = state;
  let { blockIndex } = state;

  if (blockIndex < canvasBlocks.length) {
    blockIndex += 1;
  }

  return {
    ...state,
    blockIndex
  };
};

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
const onEditorBusy = (state, action) => {
  const isBusy = action.payload;

  return {
    ...state,
    isBusy
  };
};

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
const onEditorChanged = (state, action) => {
  const isChanged = action.payload;

  return {
    ...state,
    isChanged
  };
};

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
const onEditorNew = (state, action) => {
  const blocks = Array.from(action.payload.blocks);

  blocks.sort((a, b) => {
    return (a.sortOrder > b.sortOrder) ? 1 : -1;
  });

  const canvasBlocks = [blocks];

  return {
    ...state,
    canvasBlocks,
    blockIndex: 0,
    isChanged:  false
  };
};

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
const onEditorBlocks = (state, action) => {
  const { canvasBlocks } = objects.clone(state);
  let { blockIndex } = state;

  canvasBlocks[blockIndex + 1] = Array.from(action.payload);
  blockIndex += 1;

  return {
    ...state,
    canvasBlocks,
    blockIndex
  };
};

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
const onEditorDrop = (state, action) => {
  const { sidebarBlocks, canvasBlocks } = objects.clone(state);
  let { blockIndex } = state;
  const { source, destination } = action.payload;

  if (destination && destination.droppableId !== 'sidebarBlocks') {
    if (source.droppableId === destination.droppableId) {
      canvasBlocks[blockIndex + 1] = reorder(
        canvasBlocks[blockIndex],
        source.index,
        destination.index
      );
    } else {
      canvasBlocks[blockIndex + 1] = move(
        sidebarBlocks,
        canvasBlocks[blockIndex],
        source,
        destination
      );
    }

    blockIndex += 1;
  }

  return {
    ...state,
    canvasBlocks,
    blockIndex,
    isChanged: true
  };
};

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
const onEditorMove = (state, action) => {
  const { canvasBlocks } = objects.clone(state);
  let { blockIndex } = state;
  const { block, direction } = action.payload;

  const index = arrays.findIndexByID(canvasBlocks[blockIndex], block.id);
  if (direction === 'up' && index > 0) {
    const block     = objects.clone(canvasBlocks[blockIndex][index]);
    const destClone = Array.from(canvasBlocks[blockIndex]);
    destClone.splice(index, 1);
    destClone.splice(index - 1, 0, block);

    canvasBlocks[blockIndex + 1] = destClone;
    blockIndex += 1;
  } else if (direction === 'down' && index < canvasBlocks[blockIndex].length) {
    const block     = canvasBlocks[blockIndex][index];
    const destClone = Array.from(canvasBlocks[blockIndex]);
    destClone.splice(index, 1);
    destClone.splice(index + 1, 0, block);

    canvasBlocks[blockIndex + 1] = destClone;
    blockIndex += 1;
  }

  return {
    ...state,
    canvasBlocks,
    blockIndex,
    isChanged: true
  };
};

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
const onEditorRemove = (state, action) => {
  let { canvasBlocks, blockIndex, isChanged } = objects.clone(state);
  const block = objects.clone(action.payload);

  const blocks = canvasBlocks[blockIndex].slice(0);
  const index  = arrays.findIndexByID(blocks, block.id);
  if (index !== -1) {
    blocks.splice(index, 1);
    canvasBlocks[blockIndex + 1] = blocks;
    blockIndex += 1;
    isChanged = true;
  }

  return {
    ...state,
    blockIndex,
    canvasBlocks,
    isChanged
  }
};

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
const onEditorChange = (state, action) => {
  let { canvasBlocks, blockIndex, isChanged } = objects.clone(state);
  const { id, text, caption, description, videoUrl, isHeadline } = action.payload;

  const blocks = Array.from(canvasBlocks[blockIndex]);
  const index  = arrays.findIndexByID(blocks, id);

  if (index !== -1) {
    blocks[index].text           = text;
    blocks[index].caption        = caption;
    blocks[index].isHeadline     = isHeadline;
    blocks[index].description    = description;
    blocks[index].videoUrl       = videoUrl;
    isChanged                    = true;
    canvasBlocks[blockIndex + 1] = blocks;
    blockIndex += 1;
  }

  return {
    ...state,
    blockIndex,
    canvasBlocks,
    isChanged
  }
};

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
const onEditorModal = (state, action) => {
  const modals = objects.clone(state.modals);
  const { modal, open, meta, onComplete } = action.payload;

  modals[modal] = open;

  return {
    ...state,
    modals,
    modalMeta:     meta,
    modalCallback: onComplete || (() => {})
  };
};

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
const onEditorProjects = (state, action) => {
  const projects = Array.from(action.payload);

  return {
    ...state,
    projects
  };
};

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
const onEditorTeamMember = (state, action) => {
  const teamMember = objects.clone(action.payload);

  return {
    ...state,
    teamMember
  };
};

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
const onEditorActiveBlock = (state, action) => {
  const activeBlockID = action.payload;

  return {
    ...state,
    activeBlockID
  };
};

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
const onEditorHoverBlock = (state, action) => {
  const hoverBlockID = action.payload;

  return {
    ...state,
    hoverBlockID
  };
};

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
const onEditorBlockMedia = (state, action) => {
  let { canvasBlocks, blockIndex, isChanged } = objects.clone(state);
  const { block, id, url, origFilename } = action.payload;

  const blocks = Array.from(canvasBlocks[blockIndex]);
  const index = arrays.findIndexByID(blocks, block.indexOf('n-') === 0 ? block : parseInt(block, 10));

  blocks[index].media = {
    id,
    url,
    origFilename
  };

  canvasBlocks[blockIndex + 1] = blocks;
  blockIndex += 1;
  isChanged = true;

  return {
    ...state,
    blockIndex,
    canvasBlocks,
    isChanged
  };
};

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
const onEditorToggleSidebar = (state, action) => {
  const isSidebarOpen = action.payload;

  return {
    ...state,
    isSidebarOpen
  };
};

const handlers = {
  [types.EDITOR_RESET]:          onEditorReset,
  [types.EDITOR_BUSY]:           onEditorBusy,
  [types.EDITOR_NEW]:            onEditorNew,
  [types.EDITOR_DROP]:           onEditorDrop,
  [types.EDITOR_MOVE]:           onEditorMove,
  [types.EDITOR_REMOVE]:         onEditorRemove,
  [types.EDITOR_CHANGE]:         onEditorChange,
  [types.EDITOR_UNDO]:           onEditorUndo,
  [types.EDITOR_REDO]:           onEditorRedo,
  [types.EDITOR_MODAL]:          onEditorModal,
  [types.EDITOR_BLOCKS]:         onEditorBlocks,
  [types.EDITOR_TOGGLE_SIDEBAR]: onEditorToggleSidebar,
  [types.EDITOR_BLOCK_MEDIA]:    onEditorBlockMedia,
  [types.EDITOR_TEAM_MEMBER]:    onEditorTeamMember,
  [types.EDITOR_PROJECTS]:       onEditorProjects,
  [types.EDITOR_CHANGED]:        onEditorChanged,
  [types.EDITOR_ACTIVATE_BLOCK]: onEditorActiveBlock,
  [types.EDITOR_HOVER_BLOCK]:    onEditorHoverBlock
};

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
export default function formsReducer(state = objects.clone(initialState), action = {}) {
  if (handlers[action.type]) {
    return handlers[action.type].call(null, state, action);
  }

  return state;
}
