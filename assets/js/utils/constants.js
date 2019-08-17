const blockTypesStr = {};
Object.keys(window.constants.blockTypes).forEach((key) => {
  const value = window.constants.blockTypes[key];
  blockTypesStr[value] = parseInt(key, 10);
});

/**
 * @param {number} type
 * @returns {string}
 */
export function blockType(type) {
  if (typeof type === 'string') {
    return blockTypesStr[type];
  }
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
