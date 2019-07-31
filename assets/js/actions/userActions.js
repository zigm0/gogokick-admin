import { api, router } from 'utils';

export const USER_ME = 'USER_ME';

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
