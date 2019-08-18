import { objects } from 'utils';
import * as types from 'actions/mediaActions';

const initialState = {
  isUploading: false
};

/**
 * @param {string} state
 * @param {string} action
 * @returns {{isUploading: *}}
 */
const onUploading = (state, action) => {
  const isUploading = action.payload;

  return {
    ...state,
    isUploading
  };
};

const handlers = {
  [types.MEDIA_UPLOADING]: onUploading
};

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
export default function mediaReducer(state = objects.clone(initialState), action = {}) {
  if (handlers[action.type]) {
    return handlers[action.type].call(null, state, action);
  }

  return state;
}
