import { api, router } from 'utils';
import { editorFetchProjects } from './editorActions';

export const USER_ME    = 'USER_ME';
export const USER_ERROR = 'USER_ERROR';
export const USER_BUSY  = 'USER_BUSY';

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
        } else {
          dispatch({
            type: USER_ME,
            payload
          });
          dispatch(editorFetchProjects());
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
        } else {
          dispatch({
            type: USER_ME,
            payload
          });
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
            type:    USER_ME,
            payload: {
              name: 'Guest'
            }
          });
        }
      })
      .finally(() => {
        dispatch(userBusy(false));
      });
  };
};
