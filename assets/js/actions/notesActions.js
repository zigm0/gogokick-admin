import { api, router } from 'utils';
import { editorActivateBlock } from './editorActions';
import { activitiesFetch } from './activityActions';

export const NOTES_BUSY           = 'NOTES_BUSY';
export const NOTES_VISIBLE        = 'NOTES_VISIBLE';
export const NOTES_FETCH          = 'NOTES_FETCH';
export const NOTES_DELETE         = 'NOTES_DELETE';

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
export const notesOpen = (blockID) => {
  return (dispatch) => {
    dispatch(editorActivateBlock(blockID));
    dispatch(notesVisible(true));
  };
};

/**
 * @returns {Function}
 */
export const notesClose = () => {
  return (dispatch) => {
    dispatch(editorActivateBlock(0));
    dispatch(notesVisible(false));
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
 * @param {File} attachment
 * @returns {Function}
 */
export const notesSave = (blockID, message, attachment) => {
  return (dispatch) => {
    const form = new FormData();
    form.append('message', message);
    if (attachment) {
      form.append('attachment', attachment);
    }

    dispatch(notesBusy(true));
    api.post(router.generate('api_notes_save', { blockID }), form)
      .then((notes) => {
        dispatch({
          type: NOTES_FETCH,
          notes
        });
        dispatch(activitiesFetch());
      })
      .finally(() => {
        dispatch(notesBusy(false));
      });
  };
};

/**
 * @param {number} id
 * @returns {Function}
 */
export const notesDelete = (id) => {
  return (dispatch) => {
    dispatch(notesBusy(true));
    api.req('DELETE', router.generate('api_notes_delete', { id }))
      .then(() => {
        dispatch({
          type: NOTES_DELETE,
          id
        });
      })
      .finally(() => {
        dispatch(notesBusy(false));
      });
  };
};
