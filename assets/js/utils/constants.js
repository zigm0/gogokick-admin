/**
 * @param {number} type
 * @returns {string}
 */
export function blockType(type) {
  return window.constants.blockTypes[type];
}

/**
 * @param {number} type
 * @returns {string}
 */
export function campaignType(type) {
  return window.constants.campaignTypes[type];
}

export default {
  blockType,
  campaignType
}
