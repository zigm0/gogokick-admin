import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { objects } from 'utils';
import { FormGroup } from 'components/forms';
import FormContext from 'context/formContext';

/**
 *
 */
class Select extends React.PureComponent {
  static contextType = FormContext;

  static propTypes = {
    id:           PropTypes.string.isRequired,
    sm:           PropTypes.bool,
    last:         PropTypes.bool,
    help:         PropTypes.string,
    name:         PropTypes.string,
    value:        PropTypes.string,
    values:       PropTypes.array,
    label:        PropTypes.string,
    errorMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    placeholder:  PropTypes.string,
    className:    PropTypes.string,
    disabled:     PropTypes.bool,
    required:     PropTypes.bool,
    fixedHeight:  PropTypes.bool,
    format:       PropTypes.func,
    parse:        PropTypes.func,
    onChange:     PropTypes.func,
  };

  static defaultProps = {
    help:         '',
    name:         '',
    value:        '',
    label:        '',
    placeholder:  '',
    className:    '',
    errorMessage: '',
    values:       [],
    last:         false,
    sm:           false,
    disabled:     false,
    required:     false,
    fixedHeight:  false,
    format:       v => v,
    parse:        v => v,
    onChange:     null
  };

  static unityFormType = 'select';

  /**
   * @param {React.FormEvent} e
   * @param {*} context
   */
  handleChange = (e, context) => {
    const { id, name, parse, onChange } = this.props;

    const cb = onChange || context.onChange;
    cb(e, parse(e.currentTarget.value), name || id);
  };

  /**
   * @returns {*}
   */
  render() {
    const {
      id,
      sm,
      help,
      last,
      name,
      value,
      values,
      label,
      format,
      fixedHeight,
      errorMessage,
      placeholder,
      className,
      disabled,
      required,
      ...props
    } = this.props;
    const { context } = this;

    const inputName = name || id;
    const classes   = classNames(className, 'form-control', {
      'form-control-fixed-height': fixedHeight,
      'form-control-sm':           context.sm || sm
    });

    return (
      <FormGroup
        help={help}
        htmlFor={id}
        label={label}
        className={last ? 'form-group-last' : ''}
        required={context.required || required}
        errorMessage={context.errorFields[inputName] || errorMessage}
      >
        <select
          name={inputName}
          className={classes}
          placeholder={placeholder}
          disabled={context.disabled || disabled}
          required={context.required || required}
          onChange={e => this.handleChange(e, context)}
          {...objects.keyFilter(props, Select.propTypes)}
          value={format(context.values[inputName] || value)}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {values.map((v) => {
            return (
              <option key={v.value} value={v.value}>
                {v.label}
              </option>
            );
          })}
        </select>
      </FormGroup>
    );
  }
}

export default Select;
