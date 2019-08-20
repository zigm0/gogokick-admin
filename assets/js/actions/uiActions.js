export const UI_WORKSPACE = 'UI_WORKSPACE';
export const UI_MODAL     = 'UI_MODAL';

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
