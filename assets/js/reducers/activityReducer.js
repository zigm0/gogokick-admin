import { objects } from 'utils';
import * as types from 'actions/activityActions';

const initialState = objects.merge({
  activities: []
}, window.initialState.activity);


const handlers = {};

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
