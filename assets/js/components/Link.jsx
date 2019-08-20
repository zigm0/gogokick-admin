import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { history, objects } from 'utils';

export default class Link extends React.PureComponent {
  static propTypes = {
    to:        PropTypes.string.isRequired,
    onClick:   PropTypes.func,
    className: PropTypes.string,
    children:  PropTypes.node
  };

  static defaultProps = {
    onClick:   () => {},
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
    const { className, children, ...props } = this.props;

    const classes = classNames('pointer', className);

    return (
      <a className={classes} {...objects.keyFilter(props, 'to')} onClick={this.handleClick}>
        {children}
      </a>
    );
  }
}
