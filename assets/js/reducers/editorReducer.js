import { objects } from 'utils';
import * as types from 'actions/editorActions';

const initialState = {
  init:          false,
  isBusy:        true,
  isSaving:      false,
  isChanged:     false,
  projectId:     0,
  projectName:   '',
  mode:          'kickstarter',
  projects:      [],
  templates:     [],
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
  blockIndex: 0,
  modals:     {
    login:      false,
    confirm:    false,
    settings:   false,
    register:   false,
    member:     false,
    newProject: false
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
const onEditorSaving = (state, action) => {
  const isSaving = action.payload;

  return {
    ...state,
    isBusy: isSaving,
    isSaving
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
const onEditorOpenProject = (state, action) => {
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

  const canvasBlocks  = [blocks];
  const projectName   = action.payload.name;
  const { projectId } = action.meta;

  return {
    ...state,
    projectId,
    projectName,
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
const onEditorNewProject = (state, action) => {
  const blocks = Array.from(action.payload.blocks);
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

  const canvasBlocks  = [blocks];
  const projectName   = action.payload.name;

  return {
    ...state,
    projectName,
    canvasBlocks,
    projectId:  0,
    blockIndex: 0,
    isChanged:  true
  };
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
const onEditorUpdateProject = (state, action) => {
  const settings = objects.clone(action.payload);

  return {
    ...state,
    projectName: settings.projectName,
    isChanged:   true
  }
};

const handlers = {
  [types.EDITOR_BUSY]:           onEditorBusy,
  [types.EDITOR_DROP]:           onEditorDrop,
  [types.EDITOR_UNDO]:           onEditorUndo,
  [types.EDITOR_REDO]:           onEditorRedo,
  [types.EDITOR_MODAL]:          onEditorModal,
  [types.EDITOR_PROJECTS]:       onEditorProjects,
  [types.EDITOR_TEMPLATES]:      onEditorTemplates,
  [types.EDITOR_SAVING]:         onEditorSaving,
  [types.EDITOR_CHANGED]:        onEditorChanged,
  [types.EDITOR_UPDATE_PROJECT]: onEditorUpdateProject,
  [types.EDITOR_NEW_PROJECT]:    onEditorNewProject,
  [types.EDITOR_OPEN_PROJECT]:   onEditorOpenProject
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
