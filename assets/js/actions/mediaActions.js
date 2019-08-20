import { api, router, system as systemUtils } from 'utils';
import { projectSettings, projectBusy } from './projectActions';
import { editorBlockMedia } from './editorActions';
import { uiModal } from './uiActions';

export const MEDIA_UPLOADING = 'MEDIA_UPLOADING';
export const MEDIA_CROP      = 'MEDIA_CROP';

/**
 * @param {*} payload
 * @returns {Function}
 */
export const mediaUpload = (payload) => {
  return (dispatch) => {
    const { file, block, system, onComplete } = payload;

    const body = new FormData();
    body.append('file', file);
    body.append('system', system);
    if (block) {
      body.append('block', block);
    }

    dispatch({
      type:    MEDIA_UPLOADING,
      payload: true
    });

    api.post(router.generate('api_media_upload'), body)
      .then((media) => {
        if (media.url) {
          const img = new Image();
          img.onload = () => {
            if (onComplete) {
              onComplete(media);
            } else if (system === 'project_images') {
              dispatch(projectSettings({
                image: media
              }));
            } else if (system === 'block_images') {
              dispatch(editorBlockMedia(media));
            }
          };
          img.src = media.url;
        }
      })
      .catch((err) => {
        systemUtils.prompt('Upload error', err);
      })
      .finally(() => {
        // prompts.loading(false);
        dispatch({
          type:    MEDIA_UPLOADING,
          payload: false
        });
      });

  };
};

/**
 * @param {*} payload
 * @returns {Function}
 */
export const mediaReplace = (payload) => {
  return (dispatch) => {
    const body = {
      dataUrl: payload.dataUrl
    };

    dispatch(projectBusy(true));
    dispatch({
      type:    MEDIA_UPLOADING,
      payload: true
    });

    api.post(router.generate('api_media_replace', { id: payload.media.id }), body)
      .then((resp) => {
        payload.onComplete(resp);
      })
      .finally(() => {
        dispatch(projectBusy(false));
        dispatch({
          type:    MEDIA_UPLOADING,
          payload: false
        });
      });
  }
};

export const mediaCrop = (payload) => {
  return (dispatch) => {
    dispatch(uiModal({
      modal:      'cropper',
      open:       true,
      meta:       payload.media,
      onComplete: (image) => {
        dispatch(uiModal({
          modal: 'cropper',
          open:  false
        }));
        payload.onComplete(image);
      }
    }));
  };
};
