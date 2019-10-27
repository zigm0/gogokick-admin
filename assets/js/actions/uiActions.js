import React from 'react';
import { toast } from 'react-toastify';
import ToastBody from 'components/ToastBody';

export const UI_INITIALIZE        = 'UI_INITIALIZE';
export const UI_WORKSPACE         = 'UI_WORKSPACE';
export const UI_SIDEBAR_MENU_OPEN = 'UI_SIDEBAR_MENU_OPEN';
export const UI_MODAL             = 'UI_MODAL';
export const UI_TOAST             = 'UI_TOAST';

/**
 * @param {number} width
 * @param {number} height
 * @returns {{type, width: *}}
 */
export function uiInitialize(width, height) {
  return {
    type: UI_INITIALIZE,
    height,
    width
  };
}

/**
 * @param {*} payload
 * @returns {{payload: *, type: *}}
 */
export const uiWorkspace = (payload) => {
  return {
    type: UI_WORKSPACE,
    payload
  };
};

/**
 * @param {boolean} payload
 * @returns {{payload: *, type: string}}
 */
export const uiSidebarMenuOpen = (payload) => {
  return {
    type: UI_SIDEBAR_MENU_OPEN,
    payload
  };
};

/**
 * @param {*} payload
 * @returns {{payload: *, type: *}}
 */
export const uiModal = (payload) => {
  return {
    type: UI_MODAL,
    payload
  };
};

/**
 * @param {string} payload
 * @param {*} meta
 * @returns {{payload: *, type: *}}
 */
export const uiToast = (payload, meta = {}) => {
  toast(<ToastBody type={meta.type || 'default'} message={payload} />, {
    position:        'bottom-center',
    autoClose:       4000,
    hideProgressBar: true,
    closeOnClick:    true,
    pauseOnHover:    true,
    draggable:       true,
    type:            meta.type
  });

  return {
    type: UI_TOAST,
    payload,
    meta
  };
};
