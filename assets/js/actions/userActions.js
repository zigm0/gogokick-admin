import queryString from 'query-string';
import { api, router, history } from 'utils';
import { editorFetchProjects } from './editorActions';
import { activitiesFetch } from './activityActions';
import { projectFetchWatching } from './projectActions';
import { formError } from './formActions';

export const USER_RESET   = 'USER_RESET';
export const USER_ME      = 'USER_ME';
export const USER_SAVE    = 'USER_SAVE';
export const USER_ERROR   = 'USER_ERROR';
export const USER_BUSY    = 'USER_BUSY';
export const USER_PROFILE = 'USER_PROFILE';

/**
 * @param {string} payload
 * @returns {{payload: *, type: string}}
 */
export const userError = (payload) => {
  return {
    type: USER_ERROR,
    payload
  };
};

/**
 * @param {*} payload
 * @returns {{payload: *, type: string}}
 */
export const userBusy = (payload) => {
  return {
    type: USER_BUSY,
    payload
  }
};

/**
 * @returns {Function}
 */
export const userMe = () => {
  return (dispatch) => {
    api.get(router.generate('api_user_me'))
      .then((payload) => {
        dispatch({
          type: USER_ME,
          payload
        });
      });
  };
};

/**
 * @returns {Function}
 */
export const userLogin = () => {
  return (dispatch, getState) => {
    const { forms } = getState();

    dispatch(userBusy(true));
    dispatch(userError(''));
    api.post(router.generate('api_user_login'), forms.login)
      .then((payload) => {
        if (payload._error) {
          dispatch(userError(payload._error));
          dispatch(formError('login', payload._error));
        } else {
          dispatch({
            type: USER_ME,
            payload
          });
          dispatch(editorFetchProjects());
          dispatch(activitiesFetch());
          dispatch(projectFetchWatching());

          const parsed = queryString.parse(document.location.search);
          if (parsed.back) {
            history.push(parsed.back);
          } else {
            history.push('/');
          }
        }
      })
      .finally(() => {
        dispatch(userBusy(false));
      });
  };
};

/**
 * @returns {Function}
 */
export const userRegister = () => {
  return (dispatch, getState) => {
    const { forms } = getState();

    dispatch(userBusy(true));
    dispatch(userError(''));
    api.post(router.generate('api_user_register'), forms.register)
      .then((payload) => {
        if (payload._error) {
          dispatch(userError(payload._error));
          dispatch(formError('register', payload._error));
        } else {
          dispatch({
            type: USER_ME,
            payload
          });

          const parsed = queryString.parse(document.location.search);
          if (parsed.back) {
            history.push(parsed.back);
          } else {
            history.push('/dashboard');
          }
        }
      })
      .finally(() => {
        dispatch(userBusy(false));
      });
  };
};

/**
 * @returns {Function}
 */
export const userLogout = () => {
  return (dispatch) => {

    dispatch(userBusy(true));
    dispatch(userError(''));
    api.post(router.generate('api_user_logout'))
      .then((payload) => {
        if (payload._error) {
          dispatch(userError(payload._error));
        } else {
          dispatch({
            type: USER_RESET
          });
          history.push('/');
        }
      })
      .finally(() => {
        dispatch(userBusy(false));
      });
  };
};

/**
 * @param {*} payload
 * @returns {Function}
 */
export const userSave = (payload) => {
  return (dispatch) => {
    api.post(router.generate('api_user_save'), payload)
      .then((resp) => {
        dispatch({
          type:    USER_SAVE,
          payload: resp
        });
      });
  };
};

/**
 * @param {number} payload
 * @returns {Function}
 */
export const userProfile = (payload) => {
  return (dispatch) => {
    api.get(router.generate('api_user_profile', { id: payload }))
      .then((resp) => {
        dispatch({
          type:    USER_PROFILE,
          payload: resp
        });
      });
  };
};
