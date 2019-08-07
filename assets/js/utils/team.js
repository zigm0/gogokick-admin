export const ROLE_OWNER = 0;
export const ROLE_LEAD  = 1;
export const ROLE_GUEST = 2;

const roles = {
  [ROLE_OWNER]: 'Owner',
  [ROLE_LEAD]:  'Lead',
  [ROLE_GUEST]: 'Guest'
};

/**
 * @param {number|string} role
 * @returns {string}
 */
export const roleToString = (role) => {
  return roles[parseInt(role, 10)];
};

export default {
  roleToString
}
