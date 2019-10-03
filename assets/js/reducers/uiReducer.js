import { objects, styles } from 'utils';
import * as types from 'actions/uiActions';

const initialState = {
  workspace:    'editor',
  sideMenuOpen: false,
  device:       {
    size:      'xs',
    width:     500,
    height:    800,
    isTablet:  false,
    isMobile:  true,
    isDesktop: false
  },
  modals: {
    login:         false,
    preview:       false,
    cropper:       false,
    confirm:       false,
    settings:      false,
    register:      false,
    teamMember:    false,
    addMember:     false,
    memberActions: false,
    blockSettings: false,
    blockDetails:  false
  },
  modalMeta: {
    cropper:       null,
    teamMember:    null,
    blockSettings: null,
    blockDetails:  null
  },
  modalCallbacks: {
    cropper: null
  }
};

/**
 * @param {*} state
 * @param {*} action
 */
function onInitialize(state, action) {
  const device = objects.clone(state.device);
  const { width, height } = action;
  const { breakpoints } = styles;

  device.width  = width;
  device.height = height;
  if (height <= breakpoints.sm) {
    device.size      = 'sm';
    device.isMobile  = true;
    device.isTablet  = false;
    device.isDesktop = false;
  } else if (width >= breakpoints.xl) {
    device.size     = 'xl';
    device.isMobile  = false;
    device.isTablet  = false;
    device.isDesktop = true;
  } else if (width >= breakpoints.lg) {
    device.size      = 'lg';
    device.isMobile  = false;
    device.isTablet  = false;
    device.isDesktop = true;
  } else if (width >= breakpoints.md) {
    device.size      = 'md';
    device.isMobile  = false;
    device.isTablet  = true;
    device.isDesktop = false;
  } else if (width >= breakpoints.sm) {
    device.size      = 'sm';
    device.isMobile  = true;
    device.isTablet  = false;
    device.isDesktop = false;
  } else {
    device.size      = 'xs';
    device.isMobile  = true;
    device.isTablet  = false;
    device.isDesktop = false;
  }

  return {
    ...state,
    device
  };
}

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
  const modalMeta      = objects.clone(state.modalMeta);
  const modalCallbacks = objects.clone(state.modalCallbacks);
  const { modal, open, meta, onComplete } = action.payload;

  modals[modal] = open;
  if (meta) {
    modalMeta[modal] = meta;
  }
  modalCallbacks[modal] = onComplete || (() => {});

  return {
    ...state,
    modals,
    modalMeta,
    modalCallbacks
  };
};

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
const onSidebarMenuOpen = (state, action) => {
  const sideMenuOpen = action.payload;

  return {
    ...state,
    sideMenuOpen
  };
};

const handlers = {
  [types.UI_INITIALIZE]:        onInitialize,
  [types.UI_SIDEBAR_MENU_OPEN]: onSidebarMenuOpen,
  [types.UI_WORKSPACE]:         onWorkspace,
  [types.UI_MODAL]:             onModal
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
