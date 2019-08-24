import { api, router, constants } from 'utils';
import { uiModal, uiToast } from './uiActions';
import { projectUpdateTeamMember, projectRemoveTeamMember } from './projectActions';
import { formReset } from './formActions';

export const TEAM_INVITE = 'TEAM_INVITE';
export const TEAM_REMOVE = 'TEAM_REMOVE';

/**
 * @param {*} payload
 * @returns {Function}
 */
export const teamInvite = (payload) => {
  return (dispatch, getState) => {
    const { project } = getState();

    const roles = [];
    if (payload.roleWriter) {
      roles.push(constants.projectRole('writer'));
    }
    if (payload.roleLead) {
      roles.push(constants.projectRole('lead'));
    }
    if (payload.roleGraphics) {
      roles.push(constants.projectRole('graphics'));
    }
    if (payload.roleVideo) {
      roles.push(constants.projectRole('video'));
    }
    if (payload.roleAudio) {
      roles.push(constants.projectRole('audio'));
    }

    const body = {
      project: project.id,
      email:   payload.email,
      roles
    };

    api.post(router.generate('api_team_invite'), body)
      .then((resp) => {
        if (resp._error) {
          dispatch(uiToast(resp._error, { type: 'error' }));
          return;
        }

        dispatch(uiModal({
          modal: 'addMember',
          open:  false
        }));
        dispatch(formReset('addMember'));
        dispatch(uiToast('Your invite has been sent!'));
      });
  };
};

/**
 * @param {*} payload
 * @returns {Function}
 */
export const teamMemberUpdate = (payload) => {
  return (dispatch) => {
    api.post(router.generate('api_team_update', { id: payload.id }), payload)
      .then((resp) => {
        dispatch(projectUpdateTeamMember(resp));
      });
  };
};

/**
 * @param {*} payload
 * @returns {Function}
 */
export const teamMemberRemove = (payload) => {
  return (dispatch) => {
    api.req('DELETE', router.generate('api_team_delete', { id: payload.id }))
      .then(() => {
        dispatch(projectRemoveTeamMember(payload));
      });
  }
};
