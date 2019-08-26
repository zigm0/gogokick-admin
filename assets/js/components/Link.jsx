import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { history, objects } from 'utils';
import { Icon } from 'components';

export default class Link extends React.PureComponent {
  static propTypes = {
    to:        PropTypes.string.isRequired,
    btn:       PropTypes.bool,
    icon:      PropTypes.string,
    onClick:   PropTypes.func,
    className: PropTypes.string,
    children:  PropTypes.node
  };

  static defaultProps = {
    btn:       false,
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
    const { btn, icon, className, children, ...props } = this.props;

    const classes = classNames('pointer', {
      'btn btn-primary': btn
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
