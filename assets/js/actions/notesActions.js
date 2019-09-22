import { api, router } from 'utils';
import { editorActivateBlock } from './editorActions';

export const NOTES_BUSY           = 'NOTES_BUSY';
export const NOTES_VISIBLE        = 'NOTES_VISIBLE';
export const NOTES_FETCH          = 'NOTES_FETCH';
export const NOTES_TOGGLE_VISIBLE = 'NOTES_TOGGLE_VISIBLE';

/**
 * @param {boolean} isBusy
 * @returns {{isBusy: *, type: string}}
 */
export const notesBusy = (isBusy) => {
  return {
    type: NOTES_BUSY,
    isBusy
  };
};

/**
 * @param {boolean} isVisible
 * @returns {{isVisible: *, type: string}}
 */
export const notesVisible = (isVisible) => {
  return {
    type: NOTES_VISIBLE,
    isVisible
  };
};

/**
 * @param {number} blockID
 * @returns {{type: string}}
 */
export const notesToggleVisible = (blockID) => {
  return (dispatch, getState) => {
    const { notes } = getState();

    const isVisible = !notes.isVisible;

    if (!isVisible) {
      dispatch(editorActivateBlock(0));
      dispatch(notesVisible(false));
    } else {
      dispatch(editorActivateBlock(blockID));
      dispatch(notesVisible(true));
    }
  };
};

/**
 * @param {number} blockID
 * @returns {Function}
 */
export const notesFetch = (blockID) => {
  return (dispatch) => {
    dispatch(notesBusy(true));
    api.get(router.generate('api_notes_fetch', { blockID }))
      .then((notes) => {
        dispatch({
          type: NOTES_FETCH,
          notes
        });
      })
      .finally(() => {
        dispatch(notesBusy(false));
      });
  };
};

/**
 * @param {number} blockID
 * @param {string} message
 * @returns {Function}
 */
export const notesSave = (blockID, message) => {
  return (dispatch) => {
    dispatch(notesBusy(true));
    api.post(router.generate('api_notes_save', { blockID }), { message })
      .then((notes) => {
        dispatch({
          type: NOTES_FETCH,
          notes
        });
      })
      .finally(() => {
        dispatch(notesBusy(false));
      });
  };
};
