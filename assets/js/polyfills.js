const { $ } = window;

/**
 *
 * @param {Function} cb
 * @returns {jQuery}
 */
$.fn.each$ = function(cb) {
  return this.each((i, item) => {
    return cb($(item), i);
  });
};

$.fn.map$ = function(cb) {
  return this.map((i, item) => {
    return cb($(item), i);
  });
};
