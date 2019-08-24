import Acl from 'acljs';
import constants from './constants';

const owner    = 'owner';
const lead     = 'lead';
const writer   = 'writer';
const graphics = 'graphics';
const video    = 'video';
const audio    = 'audio';

const permissions = {
  roles: [
    { name: owner },
    { name: lead },
    { name: writer },
    { name: graphics },
    { name: video },
    { name: audio }
  ],
  resources: [
    { name: 'blocks' },
    { name: 'block-text' },
    { name: 'block-image' },
    { name: 'block-video' },
    { name: 'block-audio' },
    { name: 'teamMember' }
  ],
  rules: [
    {
      role:       owner,
      access:     'allow',
      privileges: null,
      resources:  null
    },
    {
      role:       lead,
      access:     'allow',
      privileges: ['view', 'edit', 'add', 'delete', 'drag', 'settings'],
      resources:  ['blocks', 'block-text', 'block-image', 'block-video', 'block-audio']
    },
    {
      role:       lead,
      access:     'allow',
      privileges: ['view'],
      resources:  ['teamMember']
    },
    {
      role:       writer,
      access:     'allow',
      privileges: ['view'],
      resources:  ['teamMember']
    },
    {
      role:       writer,
      access:     'allow',
      privileges: ['edit'],
      resources:  ['block-text']
    },
    {
      role:       graphics,
      access:     'allow',
      privileges: ['view'],
      resources:  ['teamMember']
    },
    {
      role:       graphics,
      access:     'allow',
      privileges: ['edit'],
      resources:  ['block-image']
    },
    {
      role:       video,
      access:     'allow',
      privileges: ['view'],
      resources:  ['teamMember']
    },
    {
      role:       video,
      access:     'allow',
      privileges: ['edit'],
      resources:  ['block-video']
    },
    {
      role:       audio,
      access:     'allow',
      privileges: ['view'],
      resources:  ['teamMember']
    },
    {
      role:       audio,
      access:     'allow',
      privileges: ['edit'],
      resources:  ['block-audio']
    }
  ]
};

const acl = new Acl(permissions);

/**
 * @param {Array} roles
 * @param {string} privilege
 * @param {string} resource
 * @returns {boolean}
 */
export default (roles, privilege, resource) => {
  for (let i = 0; i < roles.length; i++) {
    if (acl.isAllowed(constants.projectRole(roles[i]), resource, privilege)) {
      return true;
    }
  }

  return false;
}
