import { api, router } from 'utils';
import { projectSettings } from './projectActions';
import { editorBlockMedia } from './editorActions';

export const MEDIA_UPLOAD = 'MEDIA_UPLOAD';


/**
 * @param {*} payload
 * @returns {Function}
 */
export const mediaUpload = (payload) => {
  return (dispatch, getState) => {
    const { project } = getState();
    const { file, block, system } = payload;

    const body = new FormData();
    body.append('file', file);
    body.append('system', system);
    body.append('project', project.id);
    if (block) {
      body.append('block', block);
    }

    api.post(router.generate('api_media_upload'), body)
      .then((media) => {
        if (system === 'project_images') {
          dispatch(projectSettings({
            image: media
          }));
        } else if (system === 'block_images') {
          dispatch(editorBlockMedia(media));
        }
      })
      .catch((err) => {
        // prompts.alert('Upload error', err);
      })
      .finally(() => {
        // prompts.loading(false);
      });

  };
};
