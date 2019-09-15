import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { history, objects } from 'utils';
import { Icon } from 'components';
import themes from 'components/bootstrap/themes';

export default class Link extends React.PureComponent {
  static propTypes = {
    to:        PropTypes.string.isRequired,
    btn:       PropTypes.bool,
    sm:        PropTypes.bool,
    icon:      PropTypes.string,
    theme:     PropTypes.oneOf(themes),
    onClick:   PropTypes.func,
    className: PropTypes.string,
    children:  PropTypes.node
  };

  static defaultProps = {
    btn:       false,
    sm:        false,
    theme:     themes[0],
    onClick:   () => {},
    icon:      '',
    className: '',
    children:  ''
  };

  /**
   * @param {Event} e
   */
  handleClick = (e) => {
    const { to, onClick } = this.props;

    onClick(e);
    if (!e.defaultPrevented) {
      e.preventDefault();
      history.push(to);
    }
  };

  /**
   * @returns {*}
   */
  render() {
    const { btn, sm, icon, theme, className, children, ...props } = this.props;

    const classes = classNames('pointer', {
      [`btn btn-${theme}`]: btn,
      'btn-sm':             sm
    }, className);

    return (
      <a className={classes} {...objects.keyFilter(props, 'to')} onClick={this.handleClick}>
        {icon && (
          <Icon className="margin-right-sm" name={icon} fixed={false} />
        )}
        {children}
      </a>
    );
  }
}
