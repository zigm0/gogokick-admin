import { arrays, objects } from 'utils';
import * as types from 'actions/projectActions';

const initialState = objects.merge({
  id:           0,
  name:         '',
  subtitle:     '',
  image:        {},
  owner:        {},
  isBusy:       false,
  isSaving:     false,
  campaignType: 1,
  team:         [],
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
 * @returns {*}
 */
const onProjectReset = () => {
  return objects.clone(initialState);
};

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
    isSaving
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
    name:     settings.name,
    subtitle: settings.subtitle,
    image:    settings.image
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
  const project = objects.clone(action.payload);

  return {
    ...state,
    ...project,
    owner: project.user
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

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
const onProjectUpdateTeamMember = (state, action) => {
  const team      = objects.clone(state.team);
  const teamMember = objects.clone(action.payload);

  const index = arrays.findIndexByID(team, teamMember.id);
  if (index !== -1) {
    team[index] = teamMember;
  }

  return {
    ...state,
    team
  };
};

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
const onProjectRemoveTeamMember = (state, action) => {
  const team       = objects.clone(state.team);
  const teamMember = objects.clone(action.payload);

  const index = arrays.findIndexByID(team, teamMember.id);
  if (index !== -1) {
    team.splice(index, 1);
  }

  return {
    ...state,
    team
  };
};

const handlers = {
  [types.PROJECT_RESET]:              onProjectReset,
  [types.PROJECT_BUSY]:               onProjectBusy,
  [types.PROJECT_SAVING]:             onProjectSaving,
  [types.PROJECT_MARK_READ]:          onProjectMarkRead,
  [types.PROJECT_DELETE]:             onProjectDelete,
  [types.PROJECT_SETTINGS]:           onProjectSettings,
  [types.PROJECT_SAVING]:             onProjectSaving,
  [types.PROJECT_SET]:                onProjectSet,
  [types.PROJECT_NEW]:                onProjectNew,
  [types.PROJECT_OPEN]:               onProjectOpen,
  [types.PROJECT_UPDATE_TEAM_MEMBER]: onProjectUpdateTeamMember,
  [types.PROJECT_REMOVE_TEAM_MEMBER]: onProjectRemoveTeamMember
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
