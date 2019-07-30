import React from 'react';
import PropTypes from 'prop-types';
import { objects } from 'utils';
import Button from './Button';

export default class ToggleButton extends React.PureComponent {
  static propTypes = {
    name:     PropTypes.string.isRequired,
    active:   PropTypes.bool,
    onValue:  PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).isRequired,
    offValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).isRequired,
    children: PropTypes.node,
    onClick:  PropTypes.func
  };

  static defaultProps = {
    active:   false,
    children: '',
    onClick:  () => {}
  };

  /**
   * @param {Event} e
   */
  handleClick = (e) => {
    const { name, active, onValue, offValue, onClick } = this.props;

    onClick(e, active ? offValue : onValue, name);
  };

  /**
   * @returns {*}
   */
  render() {
    const { children, ...props } = this.props;

    return (
      <Button {...objects.keyFilter(props, {}, ['name', 'onValue', 'offValue'])} onClick={this.handleClick}>
        {children}
      </Button>
    );
  }
}
