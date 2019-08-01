/**
 * @param {string} label
 * @param {string} value
 * @returns {Promise<any> | Promise}
 */
const confirm = (label, value = '') => {
  return new Promise((resolve) => {
    const $modal     = $('#confirm-modal').clone();
    const $input     = $modal.find('#input-confirm-input');
    const $btnOkay   = $modal.find('.modal-footer-btn-okay');
    const $btnCancel = $modal.find('.modal-footer-btn-cancel');

    $btnOkay.on('click', () => {
      const val = $input.val();
      $modal.modal('hide');
      resolve(val);
    });

    $btnCancel.on('click', () => {
      $modal.modal('hide');
      resolve('');
    });

    $modal.on('shown.bs.modal', () => {
      setTimeout(() => {
        $input.focus();
      }, 250);
    });

    $input.val(value);
    $modal.find('.modal-body label').html(label);
    $modal.modal('show');
  });
};

export default {
  confirm
};
