import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { objects } from 'utils';
import { Label } from 'components/forms';
import FormContext from 'context/formContext';
import themes from 'components/bootstrap/themes';

/**
 *
 */
class RadioGroup extends React.PureComponent {
  static contextType = FormContext;

  static propTypes = {
    id:           PropTypes.string.isRequired,
    value:        PropTypes.string,
    name:         PropTypes.string,
    label:        PropTypes.string,
    values:       PropTypes.array.isRequired,
    theme:        PropTypes.oneOf(themes),
    errorMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    disabled:     PropTypes.bool,
    required:     PropTypes.bool,
    inline:       PropTypes.bool,
    circle:       PropTypes.bool
  };

  static defaultProps = {
    name:         '',
    value:        '',
    label:        '',
    errorMessage: '',
    theme:        themes[0],
    disabled:     false,
    required:     false,
    inline:       false,
    circle:       false,
  };

  static unityFormType = 'radio';

  /**
   * @param {Event} e
   * @param {*} context
   * @param {*} item
   */
  handleChange = (e, context, item) => {
    const { id, name, onChange } = this.props;

    const cb = (onChange || context.onChange) || (() => {});
    cb(e, item.value, name || id);
  };

  /**
   * @returns {*}
   */
  render() {
    const {
      id,
      name,
      label,
      theme,
      value,
      values,
      inline,
      circle,
      errorMessage,
      disabled,
      required,
      ...props
    } = this.props;
    const { context } = this;

    const inputName  = name || id;
    const inputValue = (context.values[inputName] !== undefined) ? context.values[inputName] : value;
    const classes    = classNames(`forms-custom-checkbox forms-custom-checkbox-${theme}`, {
      'forms-custom-checkbox-inline': inline,
      'forms-custom-checkbox-circle': circle
    });

    return (
      <div id={id} {...objects.keyFilter(props, RadioGroup.propTypes)}>
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
        {(errorMessage !== '' && errorMessage !== true) && (
          <div className="form-group-error-message">
            {errorMessage}
          </div>
        )}
        {values.map(item => (
          <div key={item.value} className={classes}>
            <input
              type="radio"
              name={inputName}
              value={item.value}
              id={`${id}-${item.value}`}
              checked={inputValue === item.value}
              required={context.required || required}
              disabled={context.disabled || disabled}
              onChange={() => { /* Empty handler to prevent React throwing error. Real handler on Label. */ }}
            />
            <Label
              htmlFor={`${id}-${item.value}`}
              className="forms-custom-checkbox-label"
              onClick={e => this.handleChange(e, context, item)}
            >
              {item.label}
            </Label>
          </div>
        ))}
      </div>
    );
  }
}

export default RadioGroup;
