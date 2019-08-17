/**
 * @param {number} index
 * @param {string} alt1
 * @param {string} alt2
 * @returns {string}
 */
export function stringRoundRobin(index, alt1, alt2) {
  if (index % 2 === 0) {
    return alt1;
  }
  return alt2;
}

/**
 * @param {string|Array} pieces
 */
export function stringSpaceCommas(pieces) {
  if (!pieces) {
    return null;
  }
  let newPieces = pieces;
  if (Array.isArray(newPieces)) {
    newPieces = newPieces.join(', ');
  }

  return newPieces.replace(/,/g, ', ');
}

/**
 * @param {string} str
 */
export function stringUcWords(str) {
  return str
    .replace(/^(.)|\s+(.)/g, ($1) => {
      return $1.toUpperCase();
    });
}

/**
 * @param {string} str
 * @returns {string}
 */
export function stringEncodeURI(str) {
  return encodeURIComponent(str).replace(/%20/g, '+');
}

/**
 * @param {string} str
 * @returns {string}
 */
export function stringDecodeURI(str) {
  return decodeURIComponent(str).replace(/\+/g, ' ');
}

/**
 * @param {number} count
 * @param {string} singular
 * @param {string} plural
 * @returns {string}
 */
export function stringPluralize(count, singular, plural) {
  return count === 1 ? singular : plural;
}

/**
 * @param {string} str
 * @param {number} maxLen
 * @returns {string}
 */
export function truncate(str, maxLen) {
  if (str.length > maxLen) {
    return str.substring(0, maxLen - 3) + '...';
  }

  return str;
}

/**
 * @param {string} input
 * @param {string} allowed
 * @returns {*}
 */
export function stripTags(input, allowed) {
  allowed = (((allowed || '') + '')
    .toLowerCase()
    .match(/<[a-z][a-z0-9]*>/g) || [])
    .join('');
  const tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
  const commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;

  return input.replace(commentsAndPhpTags, '')
    .replace(tags, function($0, $1) {
      return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
    });
}

export default {
  truncate,
  stripTags,
  roundRobin:  stringRoundRobin,
  spaceCommas: stringSpaceCommas,
  ucWords:     stringUcWords,
  encodeURI:   stringEncodeURI,
  decodeURI:   stringDecodeURI,
  pluralize:   stringPluralize
};
