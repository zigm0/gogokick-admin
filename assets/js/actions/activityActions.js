import { api, router } from 'utils';

export const ACTIVITY_FETCH = 'ACTIVITY_FETCH';

/**
 * @returns {Function}
 */
export const activitiesFetch = () => {
  return (dispatch) => {
    api.get(router.generate('api_activities_fetch'))
      .then((activities) => {
        dispatch({
          type: ACTIVITY_FETCH,
          activities
        });
      });
  }
};
