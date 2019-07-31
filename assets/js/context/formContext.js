import React from 'react';

const FormContext = React.createContext({
  values:      {},
  errorFields: {},
  sm:          false,
  disabled:    false,
  required:    false,
  onChange:    null
});

export default FormContext;
