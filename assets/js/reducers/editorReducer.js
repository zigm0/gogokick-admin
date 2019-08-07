import { objects, arrays } from 'utils';
import * as types from 'actions/editorActions';

const initialState = {
  isBusy:        false,
  isChanged:     false,
  projects:      [],
  templates:     [],
  teamMember:    null,
  blockIndex:    0,
  removedBlocks: [],
  canvasBlocks:  [[]],
  sidebarBlocks: [
    {
      id:   1,
      type: 'text'
    },
    {
      id:   2,
      type: 'image'
    },
    {
      id:   3,
      type: 'video'
    }
  ],
  modals: {
    login:         false,
    preview:       false,
    confirm:       false,
    settings:      false,
    register:      false,
    newProject:    false,
    teamMember:    false,
    addMember:     false,
    memberActions: false
  }
};

let idIndex = 9;

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

  sourceBlock.id = `n-${idIndex}`;
  idIndex +=1 ;

  destClone.splice(droppableDestination.index, 0, sourceBlock);

  return destClone;
};

/**
 * @param {*} state
 * @returns {*}
 */
const onEditorReset = (state) => {
  return {
    ...state,
    canvasBlocks: [[]],
    blockIndex:   0,
    isChanged:    false
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

  blocks.sort((a, b) => {
    return (a.sortOrder > b.sortOrder) ? 1 : -1;
  });
  blocks.forEach((block) => {
    switch(block.type) {
      case 1:
        block.type = 'text';
        break;
      case 2:
        block.type = 'image';
        break;
      case 3:
        block.type = 'video';
        break;
    }
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
const onEditorRemove = (state, action) => {
  let { canvasBlocks, blockIndex, removedBlocks, isChanged } = objects.clone(state);
  const block = objects.clone(action.payload);

  const blocks = canvasBlocks[blockIndex].slice(0);
  const index  = arrays.findIndexByID(blocks, block.id);
  if (index !== -1) {
    blocks.splice(index, 1);
    canvasBlocks[blockIndex + 1] = blocks;
    removedBlocks.push(block.id);
    blockIndex += 1;
    isChanged = true;
  }

  return {
    ...state,
    blockIndex,
    canvasBlocks,
    removedBlocks,
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
  const { modal, open } = action.payload;

  modals[modal] = open;

  return {
    ...state,
    modals
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
const onEditorTemplates = (state, action) => {
  const templates = Array.from(action.payload);

  return {
    ...state,
    templates
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

const handlers = {
  [types.EDITOR_RESET]:       onEditorReset,
  [types.EDITOR_BUSY]:        onEditorBusy,
  [types.EDITOR_NEW]:         onEditorNew,
  [types.EDITOR_DROP]:        onEditorDrop,
  [types.EDITOR_REMOVE]:      onEditorRemove,
  [types.EDITOR_UNDO]:        onEditorUndo,
  [types.EDITOR_REDO]:        onEditorRedo,
  [types.EDITOR_MODAL]:       onEditorModal,
  [types.EDITOR_TEAM_MEMBER]: onEditorTeamMember,
  [types.EDITOR_PROJECTS]:    onEditorProjects,
  [types.EDITOR_TEMPLATES]:   onEditorTemplates,
  [types.EDITOR_CHANGED]:     onEditorChanged
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
