import { api, router, arrays } from 'utils';
import { setPermissions } from 'utils/acl';
import { projectSave, projectSaveBlock } from './projectActions';

export const EDITOR_RESET          = 'EDITOR_RESET';
export const EDITOR_LOADED         = 'EDITOR_LOADED';
export const EDITOR_BUSY           = 'EDITOR_BUSY';
export const EDITOR_CHANGED        = 'EDITOR_CHANGED';
export const EDITOR_NEW            = 'EDITOR_NEW';
export const EDITOR_BLOCKS         = 'EDITOR_BLOCKS';
export const EDITOR_PROJECTS       = 'EDITOR_PROJECTS';
export const EDITOR_UNDO           = 'EDITOR_UNDO';
export const EDITOR_REDO           = 'EDITOR_REDO';
export const EDITOR_MOVE           = 'EDITOR_MOVE';
export const EDITOR_DROP           = 'EDITOR_DROP';
export const EDITOR_UPDATE_BLOCK   = 'EDITOR_UPDATE_BLOCK';
export const EDITOR_REMOVE         = 'EDITOR_REMOVE';
export const EDITOR_BLOCK_MEDIA    = 'EDITOR_BLOCK_MEDIA';
export const EDITOR_BLOCK_SETTINGS = 'EDITOR_BLOCK_SETTINGS';
export const EDITOR_TEAM_MEMBER    = 'EDITOR_TEAM_MEMBER';
export const EDITOR_HOVER_BLOCK    = 'EDITOR_HOVER_BLOCK';
export const EDITOR_ACTIVATE_BLOCK = 'EDITOR_ACTIVATE_BLOCK';

/**
 * @returns {{type: string}}
 */
export const editorReset = () => {
  return {
    type: EDITOR_RESET
  };
};

/**
 * @returns {Function}
 */
export const editorLoad = () => {
  return (dispatch) => {
    api.get(router.generate('api_editor_load'))
      .then((resp) => {
        setPermissions(resp.permissions);
        dispatch({
          type: EDITOR_LOADED
        });
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
export const editorUpdateBlock = (payload) => {
  return (dispatch, getState) => {
    const { editor } = getState();
    const { canvasBlocks, blockIndex } = editor;

    const block = arrays.findByID(canvasBlocks[blockIndex], payload.id);
    if (block && !block.isLocked) {
      dispatch({
        type: EDITOR_UPDATE_BLOCK,
        payload
      });
      dispatch(projectSaveBlock(payload));
    }
  };
};

/**
 * @param {*} payload
 * @returns {Function}
 */
export const editorBlockSettings = (payload) => {
  return (dispatch) => {
    dispatch({
      type: EDITOR_BLOCK_SETTINGS,
      payload
    });

    api.post(router.generate('api_editor_block_settings', { id: payload.id }), payload);
  };
};

/**
 * @param {*} payload
 * @param {*} block
 * @returns {Function}
 */
export const editorBlockMedia = (payload) => {
  return (dispatch) => {
    dispatch({
      type: EDITOR_BLOCK_MEDIA,
      payload
    });
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
