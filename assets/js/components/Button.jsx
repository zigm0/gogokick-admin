import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon } from 'components';
import { history } from 'utils';

/**
 *
 */
export default class Button extends React.PureComponent {
  static propTypes = {
    to:        PropTypes.string,
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
    to:        '',
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
   * @param {Event} e
   */
  handleClick = (e) => {
    const { to, onClick } = this.props;

    onClick(e);
    if (to !== '' && !e.defaultPrevented) {
      history.push(to);
    }
  };

  /**
   * @returns {*}
   */
  render() {
    const { sm, lg, far, fas, icon, type, active, disabled, className, children, onClick, ...props } = this.props;

    const classes = classNames('btn', className, {
      'btn-sm':     sm,
      'btn-lg':     lg,
      'btn-active': active
    });

    if (icon) {
      return (
        <button type={type} className={classes} onClick={this.handleClick} disabled={disabled} {...props}>
          <Icon name={icon} far={far} fas={fas} />
          {children && (
            <span className="btn-label">
              {children}
            </span>
          )}
        </button>
      );
    }

    return (
      <button type={type} className={classes} onClick={this.handleClick} disabled={disabled} {...props}>
        {children}
      </button>
    );
  }
}
