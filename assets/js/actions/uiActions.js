import React from 'react';
import { toast } from 'react-toastify';
import ToastBody from 'components/ToastBody';

export const UI_WORKSPACE = 'UI_WORKSPACE';
export const UI_MODAL     = 'UI_MODAL';
export const UI_TOAST     = 'UI_TOAST';

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
    autoClose:       5000,
    hideProgressBar: true,
    closeOnClick:    true,
    pauseOnHover:    true,
    draggable:       true
  });

  return {
    type: UI_TOAST,
    payload,
    meta
  };
};
