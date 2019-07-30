import { combineReducers } from 'redux';
import forms from 'reducers/formsReducer';
import editor from 'reducers/editorReducer';

/**
 * @returns {Reducer}
 */
export default function createRootReducer() {
  return combineReducers({
    forms,
    editor
  });
}
