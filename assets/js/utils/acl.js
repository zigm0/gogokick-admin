import Acl from 'acljs';
import constants from './constants';

let acl;

/**
 * @param {*} permissions
 */
export function setPermissions(permissions) {
  acl = new Acl(permissions);
}

/**
 * @param {Array} roles
 * @param {string} privilege
 * @param {string} resource
 * @returns {boolean}
 */
export default (roles, privilege, resource) => {
  if (!acl) {
    return false;
  }

  for (let i = 0; i < roles.length; i++) {
    if (acl.isAllowed(constants.projectRole(roles[i]), resource, privilege)) {
      return true;
    }
  }

  return false;
}
