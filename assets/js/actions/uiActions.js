export const UI_MODAL          = 'UI_MODAL';
export const UI_TOGGLE_SIDEBAR = 'UI_TOGGLE_SIDEBAR';

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
 * @param {boolean} payload
 * @returns {{payload: *, type: string}}
 */
export const uiToggleSidebar = (payload) => {
  return {
    type: UI_TOGGLE_SIDEBAR,
    payload
  };
};
