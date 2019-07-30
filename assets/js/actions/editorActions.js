export const EDITOR_INIT = 'EDITOR_INIT';
export const EDITOR_DROP = 'EDITOR_DROP';

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
export const editorDrop = (payload) => {
  return {
    type: EDITOR_DROP,
    payload
  }
};
