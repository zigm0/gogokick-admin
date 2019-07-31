import { objects } from 'utils';
import * as types from 'actions/userActions';

const initialState = {
  name:            'Guest',
  isAuthenticated: false
};

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
const onUserMe = (state, action) => {
  const user = objects.clone(action.payload);
  const isAuthenticated = user !== null;

  return {
    ...state,
    ...user,
    isAuthenticated
  }
};

const handlers = {
  [types.USER_ME]: onUserMe
};

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
export default function userReducer(state = objects.clone(initialState), action = {}) {
  if (handlers[action.type]) {
    return handlers[action.type].call(null, state, action);
  }

  return state;
}
