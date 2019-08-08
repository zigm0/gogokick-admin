import { api, router } from 'utils';
import { editorModal } from './editorActions';

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
      roleEditor:   payload.roleEditor,
      roleGraphics: payload.rolGraphics
    };

    api.post(router.generate('api_team_invite'), body)
      .then((resp) => {
        console.log(resp);
        dispatch(editorModal({
          modal: 'addMember',
          open:  false
        }))
      })
  };
};
