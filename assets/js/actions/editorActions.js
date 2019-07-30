import { api } from 'utils';
export const EDITOR_INIT         = 'EDITOR_INIT';
export const EDITOR_BUSY         = 'EDITOR_BUSY';
export const EDITOR_UNDO         = 'EDITOR_UNDO';
export const EDITOR_REDO         = 'EDITOR_REDO';
export const EDITOR_LOAD_PROJECT = 'EDITOR_LOAD_PROJECT';
export const EDITOR_DROP         = 'EDITOR_DROP';

/**
 * @param {*} payload
 * @returns {Function}
 */
export const editorInit = (payload) => {
  return (dispatch) => {
    dispatch({
      type: EDITOR_INIT,
      payload
    });
  };
};

/**
 * @param {*} payload
 * @returns {{payload: *, type: string}}
 */
export const editorBusy = (payload) => {
  return {
    type: EDITOR_BUSY,
    payload
  }
};

/**
 * @param {*} payload
 * @returns {{payload: *, type: string}}
 */
export const editorUndo = (payload) => {
  return {
    type: EDITOR_UNDO,
    payload
  }
};

/**
 * @param {*} payload
 * @returns {{payload: *, type: string}}
 */
export const editorRedo = (payload) => {
  return {
    type: EDITOR_REDO,
    payload
  }
};

/**
 * @param {number} payload
 * @returns {Function}
 */
export const editorLoadProject = (payload) => {
  return (dispatch) => {
    dispatch(editorBusy(true));
    dispatch({
      type:    EDITOR_LOAD_PROJECT,
      payload: []
    });
    api.fetchBlocks(payload)
      .then((canvasBlocks) => {
        dispatch({
          type:    EDITOR_LOAD_PROJECT,
          payload: canvasBlocks
        });
      })
      .finally(() => {
        dispatch(editorBusy(false));
      });
  };
};

/**
 * @param {*} payload
 * @returns {{payload: *, type: string}}
 */
export const editorDrop = (payload) => {
  return {
    type: EDITOR_DROP,
    payload
  }
};
