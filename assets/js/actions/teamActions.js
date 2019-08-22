import { api, router } from 'utils';
import { uiModal } from './uiActions';
import { projectUpdateTeamMember } from './projectActions';

export const TEAM_INVITE = 'TEAM_INVITE';

/**
 * @param {*} payload
 * @returns {Function}
 */
export const teamInvite = (payload) => {
  return (dispatch, getState) => {
    const { project } = getState();

    const body = {
      project:      project.id,
      email:        payload.email,
      roleLead:     payload.roleLead,
      roleEditor:   payload.roleWriter,
      roleGraphics: payload.roleGraphics
    };

    api.post(router.generate('api_team_invite'), body)
      .then(() => {
        dispatch(uiModal({
          modal: 'addMember',
          open:  true
        }));
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
