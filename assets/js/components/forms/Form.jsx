import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import FormContext from 'components/forms/formContext';
import { objects, react, connect } from 'utils';
import { formChange, formReset, formComplete } from 'actions/formActions';
import { Row, Column, Alert } from 'components/bootstrap';

/**
 *
 */
class Form extends React.PureComponent {
  static propTypes = {
    name:       PropTypes.string.isRequired,
    disabled:   PropTypes.bool,
    required:   PropTypes.bool,
    onSubmit:   PropTypes.func,
    onChange:   PropTypes.func,
    onComplete: PropTypes.func,
    className:  PropTypes.string,
    children:   PropTypes.node,
    sm:         PropTypes.bool,
    forms:      PropTypes.object.isRequired,
    dispatch:   PropTypes.func.isRequired
  };

  static defaultProps = {
    sm:         false,
    disabled:   false,
    required:   false,
    className:  '',
    children:   '',
    onSubmit:   () => {},
    onChange:   () => {},
    onComplete: () => {}
  };

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.requiredInputs = [];
  }

  /**
   * Called after the component mounts
   */
  componentDidMount() {
    const { required, children } = this.props;

    react.traverseChildren(children, (child) => {
      if (react.isFormType(child)) {
        if (required || child.props.required) {
          this.requiredInputs.push(child.props.name || child.props.id);
        }
      }
    });
  }

  /**
   * Called after the component updates
   *
   * @param {*} prevProps
   */
  componentDidUpdate(prevProps) {
    const { name, dispatch, forms, onComplete } = this.props;

    if (!objects.isEqual(prevProps.forms[name], forms[name])) {
      let isComplete = true;
      const form     = forms[name];
      this.requiredInputs.forEach((n) => {
        if (!form[n]) {
          isComplete = false;
        }
      });

      if (prevProps.forms[name].isComplete !== isComplete) {
        dispatch(formComplete(name, isComplete));
        onComplete(isComplete);
      }
    }
  }

  /**
   * Called before the component unmounts
   */
  componentWillUnmount() {
    const { name, dispatch } = this.props;

    dispatch(formReset(name));
  }

  /**
   * @param {Event} e
   */
  handleSubmit = (e) => {
    const { onSubmit } = this.props;
    const { elements } = this.form;

    const values = {};
    for (let i = 0; i < elements.length; i++) {
      const { name, value, type, checked } = elements[i];
      const isCheckbox = (type === 'checkbox' || type === 'radio');
      if (name && (!isCheckbox || (isCheckbox && checked))) {
        values[name] = value;
      }
    }

    onSubmit(e, values);
  };

  /**
   * @param {Event} e
   * @param {string} value
   * @param {string} fieldName
   */
  handleChange = (e, value, fieldName) => {
    const { name, dispatch, onChange } = this.props;

    dispatch(formChange(name, fieldName, value));
    onChange(e, value, fieldName);
  };

  /**
   * @returns {*}
   */
  render() {
    const {
      sm,
      name,
      forms,
      disabled,
      required,
      className,
      children,
      ...props
    } = this.props;

    const values = forms[name];
    const contextValue = {
      sm,
      values,
      required,
      onChange:    this.handleChange,
      errorFields: values.errorFields || {},
      disabled:    (disabled || values.isSubmitting)
    };

    return (
      <form
        className={classNames('form', className, { 'form-sm': sm })}
        {...objects.keyFilter(props, Form.propTypes)}
        ref={ref => this.form = ref}
        onSubmit={this.handleSubmit}
      >
        {values.successMessage && (
          <Row>
            <Column>
              <Alert theme="success">
                {values.successMessage}
              </Alert>
            </Column>
          </Row>
        )}
        {values.errorMessage && (
          <Row>
            <Column>
              <Alert theme="danger">
                {values.errorMessage}
              </Alert>
            </Column>
          </Row>
        )}
        <FormContext.Provider value={contextValue}>
          {children}
        </FormContext.Provider>
      </form>
    );
  }
}

const mapStateToProps = state => ({
  forms: state.forms
});

export default connect(mapStateToProps)(Form);
