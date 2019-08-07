import { api, router } from 'utils';

export const EDITOR_RESET       = 'EDITOR_RESET';
export const EDITOR_BUSY        = 'EDITOR_BUSY';
export const EDITOR_CHANGED     = 'EDITOR_CHANGED';
export const EDITOR_NEW         = 'EDITOR_NEW';
export const EDITOR_SAVING      = 'EDITOR_SAVING';
export const EDITOR_PROJECTS    = 'EDITOR_PROJECTS';
export const EDITOR_TEMPLATES   = 'EDITOR_TEMPLATES';
export const EDITOR_UNDO        = 'EDITOR_UNDO';
export const EDITOR_REDO        = 'EDITOR_REDO';
export const EDITOR_DROP        = 'EDITOR_DROP';
export const EDITOR_REMOVE      = 'EDITOR_REMOVE';
export const EDITOR_MODAL       = 'EDITOR_MODAL';
export const EDITOR_TEAM_MEMBER = 'EDITOR_TEAM_MEMBER';

/**
 * @returns {{type: string}}
 */
export const editorReset = () => {
  return {
    type: EDITOR_RESET
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
export const editorNew = (payload) => {
  return {
    type: EDITOR_NEW,
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
 * @param {*} payload
 * @returns {{payload: *, type: string}}
 */
export const editorTeamMember = (payload) => {
  return {
    type: EDITOR_TEAM_MEMBER,
    payload
  };
};

/**
 * @param {*} payload
 * @returns {{payload: *, type: string}}
 */
export const editorProjects = (payload) => {
  return {
    type: EDITOR_PROJECTS,
    payload
  }
};

/**
 * @returns {Function}
 */
export const editorFetchProjects = () => {
  return (dispatch) => {
    api.get(router.generate('api_projects_get'))
      .then((payload) => {
        dispatch(editorProjects(payload));
      });
  };
};

/**
 * @returns {Function}
 */
export const editorFetchTemplates = () => {
  return (dispatch) => {
    api.get(router.generate('api_projects_templates'))
      .then((payload) => {
        dispatch({
          type: EDITOR_TEMPLATES,
          payload
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
 * @returns {{payload: *, type: string}}
 */
export const editorRemove = (payload) => {
  return (dispatch) => {
    if (!confirm('Remove this block?')) {
      return;
    }

    const id = payload.id;
    const $element = $(`#canvas-block-${id}`);
    if ($element.length > 0) {
      $element.fadeOut('slow', () => {
        dispatch({
          type: EDITOR_REMOVE,
          payload
        });
      });
    } else {
      dispatch({
        type: EDITOR_REMOVE,
        payload
      });
    }
  };
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
