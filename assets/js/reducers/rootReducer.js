import { combineReducers } from 'redux';
import forms from 'reducers/formsReducer';
import user from 'reducers/userReducer';
import team from 'reducers/teamReducer';
import media from 'reducers/mediaReducer';
import editor from 'reducers/editorReducer';
import project from 'reducers/projectReducer';

/**
 * @returns {Reducer}
 */
export default function createRootReducer() {
  return combineReducers({
    user,
    forms,
    media,
    team,
    editor,
    project
  });
}
