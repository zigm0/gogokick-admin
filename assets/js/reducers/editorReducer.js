import { objects } from 'utils';
import * as types from 'actions/editorActions';

const initialState = {
  init:         false,
  mode:         'kickstarter',
  canvasBlocks: [
    {
      id:   4,
      type: 'text'
    },
    {
      id:   5,
      type: 'image'
    },
    {
      id:   6,
      type: 'video'
    },
    {
      id:   7,
      type: 'text'
    },
    {
      id:   8,
      type: 'text'
    }
  ],
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
  ]
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

  sourceBlock.id = idIndex;
  idIndex +=1 ;

  destClone.splice(droppableDestination.index, 0, sourceBlock);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
const onEditorInit = (state, action) => {
  return state;
};

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
const onEditorDrop = (state, action) => {
  let { sidebarBlocks, canvasBlocks } = objects.clone(state);
  const { source, destination } = action.payload;

  if (destination && destination.droppableId !== 'sidebarBlocks') {
    if (source.droppableId === destination.droppableId) {
      canvasBlocks = reorder(
        canvasBlocks,
        source.index,
        destination.index
      );
    } else {
      ({ canvasBlocks } = move(
        sidebarBlocks,
        canvasBlocks,
        source,
        destination
      ));
    }
  }

  return {
    ...state,
    canvasBlocks
  };
};

const handlers = {
  [types.EDITOR_INIT]: onEditorInit,
  [types.EDITOR_DROP]: onEditorDrop
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
