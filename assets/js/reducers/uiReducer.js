import { objects } from 'utils';
import * as types from 'actions/uiActions';

const initialState = {
  workspace: 'editor',
  modals:    {
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
  modalMeta: {
    cropper:       null,
    teamMember:    null,
    blockSettings: null
  },
  modalCallbacks: {
    cropper: null
  }
};

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
const onWorkspace = (state, action) => {
  const workspace = action.payload;

  return {
    ...state,
    workspace
  };
};

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
const onModal = (state, action) => {
  const modals         = objects.clone(state.modals);
  const modalMeta      = Array.from(state.modalMeta);
  const modalCallbacks = Array.from(state.modalCallbacks);
  const { modal, open, meta, onComplete } = action.payload;

  modals[modal]         = open;
  modalMeta[modal]      = meta;
  modalCallbacks[modal] = onComplete || (() => {});

  return {
    ...state,
    modals,
    modalMeta,
    modalCallbacks
  };
};

const handlers = {
  [types.UI_WORKSPACE]: onWorkspace,
  [types.UI_MODAL]:     onModal
};

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
export default function uiReducer(state = objects.clone(initialState), action = {}) {
  if (handlers[action.type]) {
    return handlers[action.type].call(null, state, action);
  }

  return state;
}
