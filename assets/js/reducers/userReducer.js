import { objects } from 'utils';
import * as types from 'actions/userActions';

const initialState = objects.merge({
  name:            'Guest',
  skills:          [],
  error:           '',
  isBusy:          false,
  isAuthenticated: false
}, window.initialState.user);

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
const onUserMe = (state, action) => {
  const user = objects.clone(action.payload);
  const isAuthenticated = user !== null && user.name !== 'Guest';

  return {
    ...state,
    ...user,
    error:  '',
    isBusy: false,
    isAuthenticated
  }
};

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
const onUserSave = (state, action) => {
  const user = objects.clone(action.payload);

  return {
    ...state,
    ...user
  };
};

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
const onUserError = (state, action) => {
  const error = action.payload;

  return {
    ...state,
    error
  };
};

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
const onUserBusy = (state, action) => {
  const isBusy = action.payload;

  return {
    ...state,
    isBusy
  };
};

const handlers = {
  [types.USER_ME]:    onUserMe,
  [types.USER_SAVE]:  onUserSave,
  [types.USER_BUSY]:  onUserBusy,
  [types.USER_ERROR]: onUserError
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
