import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon } from 'components';

/**
 *
 */
export default class Button extends React.PureComponent {
  static propTypes = {
    sm:        PropTypes.bool,
    lg:        PropTypes.bool,
    far:       PropTypes.bool,
    fas:       PropTypes.bool,
    type:      PropTypes.string,
    icon:      PropTypes.string,
    active:    PropTypes.bool,
    disabled:  PropTypes.bool,
    className: PropTypes.string,
    children:  PropTypes.node,
    onClick:   PropTypes.func
  };

  static defaultProps = {
    sm:        false,
    lg:        false,
    far:       false,
    fas:       false,
    active:    false,
    disabled:  false,
    type:      'button',
    icon:      '',
    className: '',
    children:  '',
    onClick:   () => {}
  };

  /**
   * @returns {*}
   */
  render() {
    const { sm, lg, far, fas, icon, type, active, disabled, className, children, onClick, ...props } = this.props;

    const classes = classNames('btn-editor', className, {
      'btn-editor-sm':     sm,
      'btn-editor-lg':     lg,
      'btn-editor-active': active
    });

    if (icon) {
      return (
        <button type={type} className={classes} onClick={onClick} disabled={disabled} {...props}>
          <Icon name={icon} far={far} fas={fas} />
          {children && (
            <span className="btn-editor-label">
              {children}
            </span>
          )}
        </button>
      );
    }

    return (
      <button type={type} className={classes} onClick={onClick} disabled={disabled} {...props}>
        {children}
      </button>
    );
  }
}
