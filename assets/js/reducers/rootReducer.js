import { combineReducers } from 'redux';
import ui from 'reducers/uiReducer';
import notes from 'reducers/notesReducer';
import forms from 'reducers/formsReducer';
import user from 'reducers/userReducer';
import team from 'reducers/teamReducer';
import media from 'reducers/mediaReducer';
import editor from 'reducers/editorReducer';
import project from 'reducers/projectReducer';
import activity from 'reducers/activityReducer';
import content from 'reducers/contentReducer';

/**
 * @returns {Reducer}
 */
export default function createRootReducer() {
  return combineReducers({
    ui,
    user,
    notes,
    forms,
    media,
    team,
    editor,
    project,
    content,
    activity
  });
}
