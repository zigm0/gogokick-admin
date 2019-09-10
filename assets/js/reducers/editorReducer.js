import { objects, constants, arrays } from 'utils';
import * as types from 'actions/editorActions';

const commonBlock = {
  text:        '',
  caption:     '',
  description: '',
  link:        '',
  media:       null,
  videoUrl:    '',
  audioUrl:    '',
  height:      0,
  width:       0,
  wordCount:   0,
  aspectRatio: '16:9',
  isHeadline:  false
};

const initialState = objects.merge({
  isLoaded:      false,
  isBusy:        false,
  isChanged:     false,
  projects:      [],
  teamMember:    null,
  meTeamMember:  { roles: [] },
  blockIndex:    0,
  activeBlockID: 0,
  hoverBlockID:  0,
  canvasBlocks:  [[]],
  sidebarBlocks: [
    {
      id:   1,
      type: 'text',
      ...commonBlock
    },
    {
      id:   2,
      type: 'image',
      ...commonBlock
    },
    {
      id:   3,
      type: 'video',
      ...commonBlock
    },
    {
      id:   4,
      type: 'audio',
      ...commonBlock
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
const onEditorReset = () => {
  return objects.clone(initialState);
};

/**
 * @param {*} state
 * @returns {*}
 */
const onEditorLoaded = (state) => {
  return {
    ...state,
    isLoaded: true
  }
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
  const team   = Array.from(action.payload.team);
  const user   = objects.clone(action.payload.user);
  const me     = objects.clone(action.payload.me);

  blocks.sort((a, b) => {
    return (a.sortOrder > b.sortOrder) ? 1 : -1;
  });

  const canvasBlocks = [blocks];

  let meTeamMember;
  for (let i = 0; i < team.length; i++) {
    if (team[i].user.id === me.id) {
      meTeamMember = team[i];
    }
  }
  if (!meTeamMember && user.id === me.id) {
    meTeamMember = {
      user:  me,
      roles: [constants.projectRole('owner')]
    }
  }

  return {
    ...state,
    meTeamMember,
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
const onEditorUpdateBlock = (state, action) => {
  let { canvasBlocks, blockIndex, isChanged } = objects.clone(state);
  const { id, text, link, caption, description, videoUrl, audioUrl, isHeadline, isLocked } = action.payload;

  const blocks = Array.from(canvasBlocks[blockIndex]);
  const index  = arrays.findIndexByID(blocks, id);

  if (index !== -1) {
    blocks[index].text           = text;
    blocks[index].link           = link;
    blocks[index].caption        = caption;
    blocks[index].isLocked       = isLocked;
    blocks[index].isHeadline     = isHeadline;
    blocks[index].description    = description;
    blocks[index].videoUrl       = videoUrl;
    blocks[index].audioUrl       = audioUrl;
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
const onEditorBlockSettings = (state, action) => {
  let { canvasBlocks, blockIndex } = objects.clone(state);
  const block = objects.clone(action.payload);

  const blocks = Array.from(canvasBlocks[blockIndex]);
  const index = arrays.findIndexByID(blocks, block.id);

  blocks[index].isLocked    = block.isLocked;
  blocks[index].height      = block.height;
  blocks[index].width       = block.width;
  blocks[index].wordCount   = block.wordCount;
  blocks[index].aspectRatio = block.aspectRatio;
  blocks[index].description = block.description;
  canvasBlocks[blockIndex] = blocks;

  return {
    ...state,
    canvasBlocks
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

const handlers = {
  [types.EDITOR_RESET]:          onEditorReset,
  [types.EDITOR_LOADED]:         onEditorLoaded,
  [types.EDITOR_BUSY]:           onEditorBusy,
  [types.EDITOR_NEW]:            onEditorNew,
  [types.EDITOR_DROP]:           onEditorDrop,
  [types.EDITOR_MOVE]:           onEditorMove,
  [types.EDITOR_REMOVE]:         onEditorRemove,
  [types.EDITOR_UPDATE_BLOCK]:   onEditorUpdateBlock,
  [types.EDITOR_UNDO]:           onEditorUndo,
  [types.EDITOR_REDO]:           onEditorRedo,
  [types.EDITOR_BLOCKS]:         onEditorBlocks,
  [types.EDITOR_BLOCK_SETTINGS]: onEditorBlockSettings,
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
