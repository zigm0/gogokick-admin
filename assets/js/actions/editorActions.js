import { api, router } from 'utils';

export const EDITOR_INIT         = 'EDITOR_INIT';
export const EDITOR_BUSY         = 'EDITOR_BUSY';
export const EDITOR_CHANGED      = 'EDITOR_CHANGED';
export const EDITOR_SAVING       = 'EDITOR_SAVING';
export const EDITOR_UNDO         = 'EDITOR_UNDO';
export const EDITOR_REDO         = 'EDITOR_REDO';
export const EDITOR_OPEN_PROJECT = 'EDITOR_OPEN_PROJECT';
export const EDITOR_DROP         = 'EDITOR_DROP';
export const EDITOR_MODAL        = 'EDITOR_MODAL';

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
export const editorChanged = (payload) => {
  return {
    type: EDITOR_CHANGED,
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
 * @param {number} projectId
 * @returns {Function}
 */
export const editorOpenProject = (projectId) => {
  return (dispatch) => {
    dispatch(editorBusy(true));
    api.get(router.generate('api_blocks_open', { id: projectId }))
      .then((payload) => {
        dispatch({
          type: EDITOR_OPEN_PROJECT,
          meta: {
            projectId
          },
          payload,
        });
      })
      .finally(() => {
        dispatch(editorBusy(false));
      });
  };
};

/**
 * @returns {Function}
 */
export const editorSaveProject = () => {
  return (dispatch, getState) => {
    const { editor } = getState();

    dispatch({
      type:    EDITOR_SAVING,
      payload: true
    });

    const payload = {
      blocks: editor.canvasBlocks[editor.blockIndex]
    };

    api.post(router.generate('api_blocks_save', { id: editor.projectId }), payload)
      .then(() => {
        dispatch(editorChanged(false));
      })
      .finally(() => {
        dispatch({
          type:    EDITOR_SAVING,
          payload: false
        });
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

/**
 * @param {*} payload
 * @returns {{payload: *, type: *}}
 */
export const editorModal = (payload) => {
  return {
    type: EDITOR_MODAL,
    payload
  };
};
