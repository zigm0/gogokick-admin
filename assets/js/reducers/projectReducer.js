import { arrays, objects } from 'utils';
import * as types from 'actions/projectActions';

const initialState = objects.merge({
  id:               0,
  name:             '',
  image:            {},
  owner:            {},
  isBusy:           false,
  isSaving:         false,
  isScreenshotting: false,
  campaignType:     0,
  team:             [],
/*  teamMembers:      [
    {
      id:           1,
      name:         'Scott K.',
      avatar:       '/images/avatar-1.jpeg',
      projectRoles: ['Editor', 'Lead'],
      actions:      [
        {
          id:    1,
          block: 5,
          date:  '5 hours ago',
          title: 'Adds text block',
          memo:  ''
        }
      ]
    },
    {
      id:           2,
      name:         'Val S.',
      avatar:       '/images/avatar-2.jpeg',
      projectRoles: ['Graphics'],
      actions:      [
        {
          id:    2,
          block: 4,
          date:  'Yesterday',
          title: 'Updated image block',
          memo:  'Uses new product prototype images.'
        },
        {
          id:    3,
          block: 5,
          date:  '3 days ago',
          title: 'Updated image block',
          memo:  ''
        },
      ]
    },
    {
      id:           3,
      name:         'John R.',
      avatar:       '/images/avatar-3.jpeg',
      projectRoles: ['Owner'],
      actions:      []
    },
  ]*/
}, window.initialState.project);

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
const onProjectBusy = (state, action) => {
  const isBusy = action.payload;

  return {
    ...state,
    isBusy
  };
};

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
const onProjectSaving = (state, action) => {
  const isSaving = action.payload;

  return {
    ...state,
    isBusy: isSaving,
    isSaving
  };
};

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
const onProjectScreenshotting = (state, action) => {
  const isScreenshotting = action.payload;

  return {
    ...state,
    isScreenshotting
  };
};

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
const onProjectMarkRead = (state, action) => {
  const teamMembers = objects.clone(state.teamMembers);
  const teamMember  = action.payload;

  const user = arrays.findByID(teamMembers, teamMember.id);
  user.actions = [];

  return {
    ...state,
    teamMembers
  };
};

/**
 * @param {*} state
 * @returns {*}
 */
const onProjectDelete = (state) => {
  return {
    ...state,
    id:   0,
    name: 'Blank'
  }
};

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
const onProjectSettings = (state, action) => {
  const settings = objects.merge(state, action.payload);

  return {
    ...state,
    name:  settings.name,
    image: settings.image
  }
};

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
const onProjectNew = (state, action) => {
  const name = action.payload.name;

  return {
    ...state,
    name,
    id: 0
  };
};

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
const onProjectOpen = (state, action) => {
  const { id, name, image, user, team, campaignType } = action.payload;

  return {
    ...state,
    id,
    name,
    team,
    image,
    campaignType,
    owner: user
  };
};

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
const onProjectSet = (state, action) => {
  return onProjectOpen(state, action);
};

const handlers = {
  [types.PROJECT_BUSY]:           onProjectBusy,
  [types.PROJECT_SAVING]:         onProjectSaving,
  [types.PROJECT_SCREENSHOTTING]: onProjectScreenshotting,
  [types.PROJECT_MARK_READ]:      onProjectMarkRead,
  [types.PROJECT_DELETE]:         onProjectDelete,
  [types.PROJECT_SETTINGS]:       onProjectSettings,
  [types.PROJECT_SAVING]:         onProjectSaving,
  [types.PROJECT_SET]:            onProjectSet,
  [types.PROJECT_NEW]:            onProjectNew,
  [types.PROJECT_OPEN]:           onProjectOpen
};

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
export default function projectReducer(state = objects.clone(initialState), action = {}) {
  if (handlers[action.type]) {
    return handlers[action.type].call(null, state, action);
  }

  return state;
}
