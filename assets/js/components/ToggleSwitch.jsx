import React from 'react';
import PropTypes from 'prop-types';

export default class ToggleSwitch extends React.PureComponent {
  static propTypes = {
    id:       PropTypes.string.isRequired,
    name:     PropTypes.string.isRequired,
    checked:  PropTypes.bool,
    onChange: PropTypes.func
  };

  static defaultProps = {
    checked:  false,
    onChange: () => {}
  };

  /**
   * @returns {*}
   */
  render() {
    const { id, name, checked, onChange } = this.props;

    return (
      <div className="onoffswitch">
        <input
          type="checkbox"
          name={name}
          className="onoffswitch-checkbox"
          id={id}
          checked={checked}
          onChange={onChange}
        />
        <label className="onoffswitch-label" htmlFor={id}></label>
      </div>
    );
  }
}
