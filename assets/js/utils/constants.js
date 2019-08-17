const { constants }    = window;
const blockTypesStr    = {};
const campaignTypesStr = {};

Object.keys(constants.blockTypes).forEach((key) => {
  const value = constants.blockTypes[key];
  blockTypesStr[value] = parseInt(key, 10);
});

Object.keys(constants.campaignTypes).forEach((key) => {
  const value = constants.campaignTypes[key];
  campaignTypesStr[value] = parseInt(key, 10);
});

/**
 * @param {number} type
 * @returns {string}
 */
export function blockType(type) {
  if (typeof type === 'string') {
    return blockTypesStr[type];
  }
  return constants.blockTypes[type];
}

/**
 * @param {number} type
 * @returns {string}
 */
export function campaignType(type) {
  if (typeof type === 'string') {
    return campaignTypesStr[type];
  }
  return constants.campaignTypes[type];
}

export default {
  blockType,
  campaignType
}
