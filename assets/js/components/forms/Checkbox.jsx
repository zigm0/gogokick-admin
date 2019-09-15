import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { objects } from 'utils';
import { FormGroup, Label } from 'components/forms';
import FormContext from 'components/forms/formContext';
import themes from 'components/bootstrap/themes';

/**
 *
 */
class Checkbox extends React.PureComponent {
  static contextType = FormContext;

  static propTypes = {
    id:           PropTypes.string.isRequired,
    help:         PropTypes.string,
    name:         PropTypes.string,
    label:        PropTypes.string,
    value:        PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    theme:        PropTypes.oneOf(themes),
    errorMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    radio:        PropTypes.bool,
    checked:      PropTypes.bool,
    disabled:     PropTypes.bool,
    required:     PropTypes.bool,
    inline:       PropTypes.bool,
    circle:       PropTypes.bool,
    onChange:     PropTypes.func,
    className:    PropTypes.string
  };

  static defaultProps = {
    help:         '',
    name:         '',
    label:        '',
    value:        '',
    errorMessage: '',
    className:    '',
    theme:        themes[0],
    radio:        false,
    checked:      false,
    disabled:     false,
    required:     false,
    inline:       false,
    circle:       false,
    onChange:     null
  };

  static unityFormType = 'checkbox';

  /**
   * @param {*} props
   * @param {*} context
   */
  constructor(props, context) {
    super(props);

    const name    = props.name || props.id;
    const checked = (context.values[name] !== undefined)
      ? context.values[name]
      : props.checked;
    this.state = {
      checked
    };
  }

  /**
   * @param {React.FormEvent} e
   * @param {*} context
   */
  handleChange = (e, context) => {
    const { id, name, radio, value, onChange } = this.props;

    const checked = !this.state.checked; // eslint-disable-line
    this.setState({ checked });

    const cb = (onChange || context.onChange) || (() => {});
    if (radio) {
      cb(e, value, name || id);
    } else {
      cb(e, checked, name || id);
    }
  };

  /**
   * @returns {*}
   */
  render() {
    const {
      id,
      help,
      name,
      value,
      label,
      theme,
      radio,
      inline,
      circle,
      className,
      errorMessage,
      disabled,
      required,
      ...props
    } = this.props;
    const { checked } = this.state;
    const { context } = this;

    const inputName  = name || id;
    let inputChecked = false;
    if (!radio) {
      inputChecked = (context.values[inputName] !== undefined) ? context.values[inputName] : checked;
    } else {
      inputChecked = (context.values[inputName] !== undefined) ? context.values[inputName] === value : false;
    }
    const classes = classNames(`forms-custom-checkbox-${theme}`, className, {
      'forms-custom-checkbox-inline': inline,
      'forms-custom-checkbox-circle': circle
    });

    return (
      <FormGroup
        help={help}
        htmlFor={id}
        className={classes}
        required={context.required || required}
        errorMessage={context.errorFields[inputName] || errorMessage}
        checkbox
      >
        <input
          id={id}
          value={value}
          name={inputName}
          checked={inputChecked}
          type={radio ? 'radio' : 'checkbox'}
          required={context.required || required}
          disabled={context.disabled || disabled}
          {...objects.keyFilter(props, Checkbox.propTypes)}
          onChange={() => { /* Empty handler to prevent React throwing error. Real handler on Label. */ }}
        />
        <Label
          htmlFor={id}
          required={required}
          className="forms-custom-checkbox-label"
          onClick={e => this.handleChange(e, context)}
        >
          {label}
        </Label>
      </FormGroup>
    );
  }
}

export default Checkbox;
