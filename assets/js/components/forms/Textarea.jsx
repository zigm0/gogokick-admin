import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { objects } from 'utils';
import { FormGroup } from 'components/forms';
import FormContext from 'components/forms/formContext';

/**
 *
 */
class Textarea extends React.PureComponent {
  static contextType = FormContext;

  static propTypes = {
    id:           PropTypes.string,
    sm:           PropTypes.bool,
    help:         PropTypes.string,
    name:         PropTypes.string,
    value:        PropTypes.string,
    label:        PropTypes.string,
    errorMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    placeholder:  PropTypes.string,
    className:    PropTypes.string,
    disabled:     PropTypes.bool,
    required:     PropTypes.bool,
    format:       PropTypes.func,
    parse:        PropTypes.func,
    onChange:     PropTypes.func
  };

  static defaultProps = {
    id:           '',
    help:         '',
    name:         '',
    value:        '',
    label:        '',
    errorMessage: '',
    placeholder:  '',
    className:    '',
    sm:           false,
    disabled:     false,
    required:     false,
    format:       v => v,
    parse:        v => v,
    onChange:     null
  };

  static unityFormType = 'textarea';

  /**
   * @param {React.FormEvent} e
   * @param {*} context
   */
  handleChange = (e, context) => {
    const { id, name, parse, onChange } = this.props;

    const cb = onChange || context.onChange;
    cb(e, parse(this.textarea.value), name || id);
  };

  /**
   * @returns {*}
   */
  render() {
    const {
      id,
      sm,
      help,
      name,
      value,
      label,
      format,
      placeholder,
      errorMessage,
      className,
      disabled,
      required,
      ...props
    } = this.props;
    const { context } = this;
    const inputName = name || id;
    const classes = classNames(className, 'form-control', {
      'form-control-sm': context.sm || sm
    });

    return (
      <FormGroup
        help={help}
        htmlFor={id}
        label={label}
        required={context.required || required}
        errorMessage={context.errorFields[inputName] || errorMessage}
      >
        <textarea
          id={id}
          name={inputName}
          className={classes}
          placeholder={placeholder}
          ref={ref => this.textarea = ref}
          required={context.required || required}
          disabled={context.disabled || disabled}
          onChange={e => this.handleChange(e, context)}
          {...objects.keyFilter(props, Textarea.propTypes)}
          value={format(context.values[inputName] || value)}
        />
      </FormGroup>
    );
  }
}

export default Textarea;
