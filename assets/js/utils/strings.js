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
    .toLowerCase()
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
 * @param {string} url
 * @returns {string}
 */
export function filenameFromUrl(url) {
  const path = (new URL(url)).pathname;

  return path.replace(/^.*[/]/, '');
}

export default {
  truncate,
  filenameFromUrl,
  roundRobin:  stringRoundRobin,
  spaceCommas: stringSpaceCommas,
  ucWords:     stringUcWords,
  encodeURI:   stringEncodeURI,
  decodeURI:   stringDecodeURI,
  pluralize:   stringPluralize
};
