import { objects } from 'utils';
import * as types from 'actions/activityActions';

const initialState = objects.merge({
  activities: []
}, window.initialState.activity);

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
const onFetch = (state, action) => {
  const activities = objects.clone(action.activities);

  return {
    ...state,
    activities
  };
};

const handlers = {
  [types.ACTIVITY_FETCH]: onFetch
};

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
export default function activityReducer(state = objects.clone(initialState), action = {}) {
  if (handlers[action.type]) {
    return handlers[action.type].call(null, state, action);
  }

  return state;
}
