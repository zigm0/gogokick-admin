const { constants }        = window;
export const blockTypes    = constants.blockTypes;
export const campaignTypes = constants.campaignTypes;
const blockTypesStr        = {};
const campaignTypesStr     = {};

Object.keys(blockTypes).forEach((key) => {
  const value = blockTypes[key];
  blockTypesStr[value] = parseInt(key, 10);
});

Object.keys(campaignTypes).forEach((key) => {
  const value = campaignTypes[key];
  campaignTypesStr[value] = parseInt(key, 10);
});

/**
 * @param {number|string} type
 * @returns {string}
 */
export function blockType(type) {
  if (typeof type === 'string') {
    return blockTypesStr[type];
  }
  return constants.blockTypes[type];
}

/**
 * @param {number|string} type
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
