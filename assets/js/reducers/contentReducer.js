import { objects } from 'utils';

const initialState = objects.merge({
  missing: ''
}, window.initialState.content);

const handlers = {};

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
export default function contentReducer(state = objects.clone(initialState), action = {}) {
  if (handlers[action.type]) {
    return handlers[action.type].call(null, state, action);
  }

  return state;
}
