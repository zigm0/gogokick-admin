import { api, router, history } from 'utils';
import { editorReset, editorNew, editorBlocks, editorChanged, editorProjects } from './editorActions';
import { uiToast } from './uiActions';

export const PROJECT_RESET              = 'PROJECT_RESET';
export const PROJECT_BUSY               = 'PROJECT_BUSY';
export const PROJECT_SAVING             = 'PROJECT_SAVING';
export const PROJECT_SET                = 'PROJECT_SET';
export const PROJECT_NEW                = 'PROJECT_NEW_PROJECT';
export const PROJECT_OPEN               = 'PROJECT_OPEN_PROJECT';
export const PROJECT_UPDATE_TEAM_MEMBER = 'PROJECT_UPDATE_TEAM_MEMBER';
export const PROJECT_REMOVE_TEAM_MEMBER = 'PROJECT_REMOVE_TEAM_MEMBER';
export const PROJECT_SETTINGS           = 'PROJECT_SETTINGS';
export const PROJECT_WATCHING           = 'PROJECT_WATCHING';
export const PROJECT_DOWNLOAD_IMAGES    = 'PROJECT_DOWNLOAD_IMAGES';
export const PROJECT_DELETE             = 'PROJECT_DELETE_PROJECT';
export const PROJECT_MARK_READ          = 'PROJECT_MARK_READ';

/**
 * @returns {{type: string}}
 */
export const projectReset = () => {
  return (dispatch) => {
    dispatch({
      type: PROJECT_RESET
    });
    dispatch(editorReset());
  };
};

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
 * @param {number} id
 * @param {*} meta
 * @returns {Function}
 */
export const projectOpen = (id, meta = {}) => {
  return (dispatch, getState) => {
    if (!id) {
      dispatch(projectReset());
      return;
    }

    dispatch(projectBusy(true));
    api.get(router.generate('api_projects_open', { id }))
      .then((payload) => {
        const { user } = getState();

        payload.me = user;
        dispatch(editorNew(payload));
        dispatch({
          type: PROJECT_OPEN,
          payload,
        });

        if (meta.redirectAfterOpen === undefined || meta.redirectAfterOpen) {
          setTimeout(() => {
            dispatch(projectBusy(false));

            let url = `/editor/${payload.id}`;
            if (document.location.hash) {
              url = `${url}${document.location.hash}`;
            }
            history.push(url);
          }, 1000);
        } else {
          dispatch(projectBusy(false));
        }
      })
      .catch(() => {
        dispatch(projectBusy(false));
      });
  };
};

/**
 * @param {*} payload
 * @returns {{payload: *, type: string}}
 */
export const projectNew = (payload) => {
  return (dispatch) => {
    dispatch(projectBusy(true));
    dispatch({
      type:    PROJECT_SAVING,
      payload: true
    });

    api.req('PUT', router.generate('api_projects_save_new'), payload)
      .then((resp) => {
        history.push(`/editor/${resp.project.id}`);
        dispatch({
          type:    PROJECT_SET,
          payload: resp.project
        });
        dispatch(editorNew(resp.project));
        dispatch(editorProjects(resp.projects));
        dispatch(editorChanged(false));
      })
      .finally(() => {
        dispatch({
          type:    PROJECT_SAVING,
          payload: false
        });
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

    dispatch({
      type:    PROJECT_SAVING,
      payload: true
    });

    const body = {
      ...project,
      blocks: editor.canvasBlocks[editor.blockIndex]
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
        history.push(`/editor/${payload.project.id}`);
        dispatch({
          type:    PROJECT_SET,
          payload: payload.project
        });
        dispatch(editorBlocks(payload.project.blocks));
        dispatch(editorProjects(payload.projects));
        dispatch(editorChanged(false));
      })
      .catch((err) => {
        if (err.response.data._error) {
          dispatch(uiToast(err.response.data._error, { type: 'error' }));
        } else {
          dispatch(uiToast(err.toString(), { type: 'error' }));
        }
      })
      .finally(() => {
        dispatch({
          type:    PROJECT_SAVING,
          payload: false
        });
      });
  };
};

/**
 * @param {*} payload
 * @returns {Function}
 */
export const projectSaveBlock = (payload) => {
  return (dispatch) => {
    const url = router.generate('api_projects_save_block', { id: payload.id });
    api.post(url, payload)
      .then(() => {
        // console.log(resp);
      });
  };
};

/**
 * @param {number} id
 * @returns {Function}
 */
export const projectDelete = (id) => {
  return (dispatch) => {
    dispatch(projectBusy(true));
    api.req('DELETE', router.generate('api_projects_delete', { id }))
      .then((payload) => {
        dispatch(editorReset());
        dispatch(editorProjects(payload));
        dispatch({
          type: PROJECT_DELETE
        });
        history.push('/dashboard');
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
export const projectSettings = (payload) => {
  return (dispatch, getState) => {
    dispatch(editorChanged(true));
    dispatch({
      type: PROJECT_SETTINGS,
      payload
    });

    const { project } = getState();
    if (project.id) {
      api.post(router.generate('api_projects_settings', { id: project.id }), project)
        .then(() => {
          uiToast('Project settings updated.');
        });
    }
  };
};

/**
 * @param {number} id
 * @returns {Function}
 */
export const projectDownloadImages = (id) => {
  return (dispatch) => {
    dispatch(projectBusy(true));
    api.get(router.generate('api_projects_images', { id }))
      .then((resp) => {
        document.location = resp.url;
      })
      .finally(() => {
        dispatch(projectBusy(false));
      });
  }
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

/**
 * @param {*} payload
 * @returns {{payload: *, type: string}}
 */
export const projectUpdateTeamMember = (payload) => {
  return {
    type: PROJECT_UPDATE_TEAM_MEMBER,
    payload
  };
};

/**
 * @param {*} payload
 * @returns {{payload: *, type: string}}
 */
export const projectRemoveTeamMember = (payload) => {
  return {
    type: PROJECT_REMOVE_TEAM_MEMBER,
    payload
  };
};

/**
 * @param {number} id
 * @returns {Function}
 */
export const projectWatch = (id) => {
  return (dispatch, getState) => {
    const { user } = getState();

    if (!user.isAuthenticated) {
      history.push('/login');
    }

    dispatch(projectBusy(true));
    api.post(router.generate('api_projects_watch', { id }))
      .then((watching) => {
        dispatch({
          type: PROJECT_WATCHING,
          watching
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
export const projectFetchWatching = () => {
  return (dispatch) => {
    api.get(router.generate('api_projects_fetch_watching'))
      .then((watching) => {
        dispatch({
          type: PROJECT_WATCHING,
          watching
        });
      });
  };
};
