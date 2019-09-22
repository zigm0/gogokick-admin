import { objects, arrays } from 'utils';
import * as types from 'actions/notesActions';

const initialState = {
  notes:     [],
  isBusy:    false,
  isVisible: false
};

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
const onBusy = (state, action) => {
  return {
    ...state,
    isBusy: action.isBusy
  };
};

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
const onVisible = (state, action) => {
  return {
    ...state,
    isVisible: action.isVisible
  };
};

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
const onFetch = (state, action) => {
  const notes = objects.clone(action.notes);

  return {
    ...state,
    notes
  };
};

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
const onDelete = (state, action) => {
  const notes = objects.clone(state.notes);
  const { id } = action;

  const index = arrays.findIndexByID(notes, id);
  if (index !== -1) {
    notes.splice(index, 1);
  }

  return {
    ...state,
    notes
  };
};

const handlers = {
  [types.NOTES_BUSY]:    onBusy,
  [types.NOTES_FETCH]:   onFetch,
  [types.NOTES_DELETE]:  onDelete,
  [types.NOTES_VISIBLE]: onVisible
};

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
export default function notesReducer(state = objects.clone(initialState), action = {}) {
  if (handlers[action.type]) {
    return handlers[action.type].call(null, state, action);
  }

  return state;
}
