import { api, router } from 'utils';
import html2canvas from "html2canvas";
import { editorReset, editorNew, editorChanged, editorProjects } from "./editorActions";

export const PROJECT_BUSY           = 'PROJECT_BUSY';
export const PROJECT_SAVING         = 'EDITOR_SAVING';
export const PROJECT_NEW            = 'EDITOR_NEW_PROJECT';
export const PROJECT_OPEN           = 'EDITOR_OPEN_PROJECT';
export const PROJECT_UPDATE         = 'EDITOR_UPDATE_PROJECT';
export const PROJECT_DELETE         = 'EDITOR_DELETE_PROJECT';
export const PROJECT_MARK_READ      = 'EDITOR_MARK_READ';
export const PROJECT_SCREENSHOTTING = 'PROJECT_SCREENSHOTTING';

/**
 * @param {*} payload
 * @returns {{payload: *, type: string}}
 */
export const projectBusy = (payload) => {
  return {
    type: PROJECT_BUSY,
    payload
  }
};

/**
 * @param {*} payload
 * @returns {{payload: *, type: string}}
 */
export const projectScreenshotting = (payload) => {
  return {
    type: PROJECT_SCREENSHOTTING,
    payload
  }
};

/**
 * @param {*} payload
 * @returns {{payload: *, type: string}}
 */
export const projectNew = (payload) => {
  return (dispatch) => {
    dispatch(editorNew(payload));
    dispatch({
      type: PROJECT_NEW,
      payload
    });
  };
};

/**
 * @param {number} id
 * @returns {Function}
 */
export const projectOpen = (id) => {
  return (dispatch) => {
    dispatch(projectBusy(true));
    api.get(router.generate('api_projects_open', { id }))
      .then((payload) => {
        dispatch(editorNew(payload));
        dispatch({
          type: PROJECT_OPEN,
          payload,
        });
      })
      .finally(() => {
        dispatch(projectBusy(false));
      });
  };
};

/**
 * @returns {Function}
 */
export const projectSave = () => {
  return (dispatch, getState) => {
    const { editor, project } = getState();

    dispatch(projectBusy(true));
    dispatch({
      type:    PROJECT_SAVING,
      payload: true
    });

    dispatch(projectScreenshotting(true));
    html2canvas(document.querySelector('.editor-canvas-blocks'))
      .then((canvas) => {
        dispatch(projectScreenshotting(false));
        const screenshot = canvas.toDataURL();

        const body = {
          screenshot,
          name:    project.name,
          blocks:  editor.canvasBlocks[editor.blockIndex],
          removed: editor.removedBlocks
        };

        let promise = null;
        if (project.id === 0) {
          const url = router.generate('api_projects_save_new');
          promise = api.req('PUT', url, body);
        } else {
          const url = router.generate('api_projects_save', {
            id: project.id
          });
          promise = api.req('POST', url, body);
        }

        promise
          .then((payload) => {
            dispatch(editorProjects(payload));
            dispatch(editorChanged(false));
          })
          .finally(() => {
            dispatch({
              type:    PROJECT_SAVING,
              payload: false
            });
            dispatch(projectBusy(false));
          });
      });
  };
};

/**
 * @returns {Function}
 */
export const projectDelete = () => {
  return (dispatch, getState) => {
    const { project } = getState();

    dispatch(projectBusy(true));
    api.req('DELETE', router.generate('api_projects_delete', { id: project.id }))
      .then((payload) => {
        dispatch(editorReset());
        dispatch(editorProjects(payload));
        dispatch({
          type: PROJECT_DELETE
        });
      })
      .finally(() => {
        dispatch(projectBusy(false));
      });
  };
};

/**
 * @param {*} payload
 * @returns {{payload: *, type: string}}
 */
export const projectUpdate = (payload) => {
  return (dispatch) => {
    dispatch(editorChanged(true));
    dispatch({
      type: PROJECT_UPDATE,
      payload
    });
  };
};


/**
 * @param {*} payload
 * @returns {{payload: *, type: string}}
 */
export const projectMarkRead = (payload) => {
  return {
    type: PROJECT_MARK_READ,
    payload
  };
};

