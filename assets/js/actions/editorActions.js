import { api, router } from 'utils';
import { projectSave } from './projectActions';

export const EDITOR_RESET          = 'EDITOR_RESET';
export const EDITOR_BUSY           = 'EDITOR_BUSY';
export const EDITOR_CHANGED        = 'EDITOR_CHANGED';
export const EDITOR_NEW            = 'EDITOR_NEW';
export const EDITOR_BLOCKS         = 'EDITOR_BLOCKS';
export const EDITOR_PROJECTS       = 'EDITOR_PROJECTS';
export const EDITOR_UNDO           = 'EDITOR_UNDO';
export const EDITOR_REDO           = 'EDITOR_REDO';
export const EDITOR_MOVE           = 'EDITOR_MOVE';
export const EDITOR_DROP           = 'EDITOR_DROP';
export const EDITOR_CHANGE         = 'EDITOR_CHANGE';
export const EDITOR_REMOVE         = 'EDITOR_REMOVE';
export const EDITOR_BLOCK_MEDIA    = 'EDITOR_BLOCK_MEDIA';
export const EDITOR_MODAL          = 'EDITOR_MODAL';
export const EDITOR_TEAM_MEMBER    = 'EDITOR_TEAM_MEMBER';
export const EDITOR_HOVER_BLOCK    = 'EDITOR_HOVER_BLOCK';
export const EDITOR_ACTIVATE_BLOCK = 'EDITOR_ACTIVATE_BLOCK';
export const EDITOR_TOGGLE_SIDEBAR = 'EDITOR_TOGGLE_SIDEBAR';

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
 * @param {Array} payload
 * @returns {{payload: *, type: string}}
 */
export const editorBlocks = (payload) => {
  return {
    type: EDITOR_BLOCKS,
    payload
  };
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
 * @returns {Function}
 */
export const editorUndo = (payload) => {
  return (dispatch) => {
    dispatch({
      type: EDITOR_UNDO,
      payload
    });
    dispatch(projectSave());
  };
};

/**
 * @param {*} payload
 * @returns {Function}
 */
export const editorRedo = (payload) => {
  return (dispatch) => {
    dispatch({
      type: EDITOR_REDO,
      payload
    });
    dispatch(projectSave());
  };
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
 * @param {*} payload
 * @returns {{payload: *, type: string}}
 */
export const editorDrop = (payload) => {
  return (dispatch) => {
    dispatch({
      type: EDITOR_DROP,
      payload
    });
    dispatch(projectSave());
  };
};

/**
 * @param {*} payload
 * @returns {Function}
 */
export const editorMove = (payload) => {
  return (dispatch) => {
    dispatch({
      type: EDITOR_MOVE,
      payload
    });
    dispatch(projectSave());
  };
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
      dispatch(projectSave());
    }
  };
};

/**
 * @param {*} payload
 * @returns {Function}
 */
export const editorChange = (payload) => {
  return (dispatch) => {
    dispatch({
      type: EDITOR_CHANGE,
      payload
    });
    dispatch(projectSave());
  };
};

/**
 * @param {*} payload
 * @returns {Function}
 */
export const editorBlockMedia = (payload) => {
  return (dispatch) => {
    dispatch({
      type: EDITOR_BLOCK_MEDIA,
      payload
    });
    dispatch(projectSave());
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

/**
 * @param {number} payload
 * @returns {{payload: *, type: string}}
 */
export const editorActivateBlock = (payload) => {
  return {
    type: EDITOR_ACTIVATE_BLOCK,
    payload
  };
};

/**
 * @param {number} payload
 * @returns {{payload: *, type: string}}
 */
export const editorHoverBlock = (payload) => {
  return {
    type: EDITOR_HOVER_BLOCK,
    payload
  };
};

/**
 * @param {boolean} payload
 * @returns {{payload: *, type: string}}
 */
export const editorToggleSidebar = (payload) => {
  return {
    type: EDITOR_TOGGLE_SIDEBAR,
    payload
  };
};
