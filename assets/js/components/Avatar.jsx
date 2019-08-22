import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { constants, objects } from 'utils';

/**
 *
 */
export default class Avatar extends React.PureComponent {
  static propTypes = {
    src:   PropTypes.string.isRequired,
    roles: PropTypes.array,
    sm:    PropTypes.bool,
    lg:    PropTypes.bool,
    xl:    PropTypes.bool
  };

  static defaultProps = {
    roles: [],
    sm:    false,
    lg:    false,
    xl:    false
  };

  /**
   * @returns {string}
   */
  getRolesString = () => {
    const { roles } = this.props;

    if (roles.length === 0) {
      return '';
    }

    const parts = [];
    objects.forEach(constants.projectRoles, (role) => {
      if (roles.includes(constants.projectRole(role))) {
        parts.push(role);
      }
    });

    return `avatar-roles avatar-roles-${roles.length} avatar-role-${parts.join('-')}`;
  };

  /**
   * @returns {*}
   */
  render() {
    const { src, sm, lg, xl, ...props } = this.props;

    const classes = classNames('avatar', this.getRolesString(), {
      'avatar-sm': sm,
      'avatar-lg': lg,
      'avatar-xl': xl
    });

    return (
      <span className={classes} {...props}>
        <img src={src} alt="Avatar" />
      </span>
    );
  }
}
