import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { objects } from 'utils';
import { FormGroup } from 'components/forms';
import FormContext from 'components/forms/formContext';

/**
 *
 */
class Input extends React.PureComponent {
  static contextType = FormContext;

  static propTypes = {
    id:           PropTypes.string.isRequired,
    sm:           PropTypes.bool,
    help:         PropTypes.string,
    name:         PropTypes.string,
    type:         PropTypes.string,
    label:        PropTypes.string,
    value:        PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    errorMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    placeholder:  PropTypes.string,
    className:    PropTypes.string,
    focused:      PropTypes.bool,
    disabled:     PropTypes.bool,
    required:     PropTypes.bool,
    last:         PropTypes.bool,
    format:       PropTypes.func,
    parse:        PropTypes.func,
    onChange:     PropTypes.func,
    forms:        PropTypes.object
  };

  static defaultProps = {
    help:         '',
    name:         '',
    type:         'text',
    value:        '',
    label:        '',
    placeholder:  '',
    className:    '',
    errorMessage: '',
    sm:           false,
    focused:      false,
    disabled:     false,
    required:     false,
    last:         false,
    forms:        {},
    format:       v => v,
    parse:        v => v,
    onChange:     null
  };

  static unityFormType = 'input';

  /**
   * Called when the component mounts
   */
  componentDidMount() {
    const { focused } = this.props;

    if (focused) {
      setTimeout(() => {
        this.focus();
      }, 500);
    }
  }

  /**
   * @returns {string}
   */
  getValue = () => {
    return this.input.value;
  };

  /**
   * Gives focus to the element
   */
  focus = () => {
    this.input.focus();
  };

  /**
   * @param {React.FormEvent} e
   * @param {*} context
   */
  handleChange = (e, context) => {
    const { id, name, parse, onChange } = this.props;

    const cb = onChange || context.onChange;
    cb(e, parse(this.input.value), name || id);
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
      type,
      last,
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
        className={last ? 'form-group-last' : ''}
        required={context.required || required}
        errorMessage={context.errorFields[inputName] || errorMessage}
      >
        <input
          id={id}
          type={type}
          name={inputName}
          className={classes}
          placeholder={placeholder}
          ref={ref => this.input = ref}
          required={context.required || required}
          disabled={context.disabled || disabled}
          onChange={e => this.handleChange(e, context)}
          {...objects.keyFilter(props, Input.propTypes)}
          value={format(context.values[inputName] || value)}
        />
      </FormGroup>
    );
  }
}

export default Input;
