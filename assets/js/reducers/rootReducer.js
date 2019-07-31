import { combineReducers } from 'redux';
import forms from 'reducers/formsReducer';
import user from 'reducers/userReducer';
import editor from 'reducers/editorReducer';

/**
 * @returns {Reducer}
 */
export default function createRootReducer() {
  return combineReducers({
    user,
    forms,
    editor
  });
}
