import { arrays, objects } from 'utils';
import * as types from 'actions/teamActions';

const initialState = {};

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
const onTeamInvite = (state, action) => {
  return state;
};

const handlers = {
  [types.TEAM_INVITE]: onTeamInvite
};

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
export default function teamReducer(state = objects.clone(initialState), action = {}) {
  if (handlers[action.type]) {
    return handlers[action.type].call(null, state, action);
  }

  return state;
}
