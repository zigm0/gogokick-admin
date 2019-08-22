const { constants }        = window;
export const blockTypes    = constants.blockTypes;
export const campaignTypes = constants.campaignTypes;
export const projectRoles  = constants.projectRoles;

const blockTypesStr    = {};
const campaignTypesStr = {};
const projectRolesStr  = {};

Object.keys(blockTypes).forEach((key) => {
  const value = blockTypes[key];
  blockTypesStr[value] = parseInt(key, 10);
});

Object.keys(campaignTypes).forEach((key) => {
  const value = campaignTypes[key];
  campaignTypesStr[value] = parseInt(key, 10);
});

Object.keys(projectRoles).forEach((key) => {
  const value = projectRoles[key];
  projectRolesStr[value] = parseInt(key, 10);
});

/**
 * @param {number|string} type
 * @returns {string}
 */
export function blockType(type) {
  if (typeof type === 'string') {
    return blockTypesStr[type];
  }
  return blockTypes[type];
}

/**
 * @param {number|string} type
 * @returns {string}
 */
export function campaignType(type) {
  if (typeof type === 'string') {
    return campaignTypesStr[type];
  }
  return campaignTypes[type];
}

/**
 * @param {number|string} type
 * @returns {string}
 */
export function projectRole(type) {
  if (typeof type === 'string') {
    return projectRolesStr[type];
  }
  return projectRoles[type];
}

export default {
  blockType,
  campaignType,
  projectRole
}
