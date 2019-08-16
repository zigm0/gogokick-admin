/**
 * @param {number} type
 * @returns {string}
 */
export function blockTypeString(type) {
  return window.constants.blockTypes[type];
}

/**
 * @param {number} type
 * @returns {string}
 */
export function campaignTypeString(type) {
  return window.constants.campaignTypes[type];
}

export default {
  blockTypeString,
  campaignTypeString
}
