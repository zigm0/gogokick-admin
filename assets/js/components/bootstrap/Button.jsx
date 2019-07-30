import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import themes from 'components/bootstrap/themes';
import { Icon, Loading } from 'components';
import { objects } from 'utils';

/**
 *
 */
class Button extends React.PureComponent {
  static propTypes = {
    theme:     PropTypes.oneOf(themes),
    block:     PropTypes.bool,
    lg:        PropTypes.bool,
    sm:        PropTypes.bool,
    icon:      PropTypes.string,
    loading:   PropTypes.bool,
    className: PropTypes.string,
    disabled:  PropTypes.bool,
    children:  PropTypes.node,
    onClick:   PropTypes.func
  };

  static defaultProps = {
    theme:     themes[0],
    block:     false,
    lg:        false,
    sm:        false,
    loading:   false,
    icon:      '',
    className: '',
    disabled:  false,
    children:  '',
    onClick:   () => {}
  };

  /**
   * @returns {*}
   */
  render() {
    const { theme, block, lg, sm, icon, loading, disabled, className, children, onClick, ...props } = this.props;

    const classes = classNames(`btn btn-${theme}`, className, {
      'btn-block': block,
      'btn-lg':    lg,
      'btn-sm':    sm
    });

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={classes}
        {...objects.keyFilter(props, Button.propTypes)}
      >
        {(icon && !loading) && (
          <Icon name={icon} />
        )}
        {loading ? (
          <Loading color="#FFF" style={{ margin: 3 }} />
        ) : (
          children
        )}
      </button>
    );
  }
}

export default Button;
