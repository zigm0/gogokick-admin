/**
 * @param {string} label
 * @param {string} value
 * @returns {Promise<any> | Promise}
 */
const prompt = (label, value = '') => {
  return new Promise((resolve) => {
    const $modal     = $('#modal-prompt').clone();
    const $input     = $modal.find('#input-prompt-input');
    const $btnOkay   = $modal.find('.modal-footer-btn-okay');
    const $btnCancel = $modal.find('.modal-footer-btn-cancel');
    const $backdrop  = $('<div class="modal-backdrop modal-backdrop-confirm show" />');

    $btnOkay.on('click', () => {
      const val = $input.val();
      $modal.modal('hide');
      $backdrop.remove();
      resolve(val);
    });

    $btnCancel.on('click', () => {
      $modal.modal('hide');
      $backdrop.remove();
      resolve('');
    });

    $modal.on('shown.bs.modal', () => {
      setTimeout(() => {
        $input.focus();
      }, 250);
    });

    $input.val(value);
    $modal.find('.modal-body label').html(label);

    $('body').append($backdrop);
    $modal.modal('show');
  });
};

/**
 * @param {string} label
 * @returns {Promise<any> | Promise}
 */
const confirm = (label) => {
  return new Promise((resolve) => {
    const $modal     = $('#modal-confirm').clone();
    const $btnOkay   = $modal.find('.modal-footer-btn-okay');
    const $btnCancel = $modal.find('.modal-footer-btn-cancel');
    const $backdrop  = $('<div class="modal-backdrop modal-backdrop-confirm show" />');

    $btnOkay.on('click', () => {
      $modal.modal('hide');
      $backdrop.remove();
      resolve(true);
    });

    $btnCancel.on('click', () => {
      $modal.modal('hide');
      $backdrop.remove();
      resolve(false);
    });

    $modal.find('.modal-body-label').html(label);
    $('body').append($backdrop);
    $modal.modal('show');
  });
};

export default {
  prompt,
  confirm
};
