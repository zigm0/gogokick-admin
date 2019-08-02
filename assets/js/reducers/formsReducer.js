import * as types from 'actions/formActions';
import { objects } from 'utils';

/**
 *
 */
const commonForms = {
  errorMessage:   '',
  successMessage: '',
  errorFields:    {},
  isChanged:      false,
  isSubmitting:   false,
  isSubmitted:    false,
  isSuccess:      false,
  isComplete:     false
};

const initialState = {
  login: {
    email:    '',
    password: '',
    ...commonForms
  },
  register: {
    name:     '',
    email:    '',
    password: '',
    ...commonForms
  },
  projectSettings: {
    name: '',
    ...commonForms
  },
  prompt: {
    input: '',
    ...commonForms
  },
  teamMember: {
    roleEditor:   false,
    roleGraphics: false,
    roleLead:     false,
    ...commonForms
  },
  addMember: {
    email:        '',
    roleEditor:   false,
    roleGraphics: false,
    roleLead:     false,
    ...commonForms
  }
};

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function formChange(state, action) {
  const form        = objects.clone(state[action.formName]);
  form[action.name] = action.value;
  form.isChanged    = true;

  return {
    ...state,
    [action.formName]: form
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function formChanges(state, action) {
  const form   = objects.clone(state[action.formName]);
  const values = objects.clone(action.values);

  Object.keys(values).forEach((key) => {
    form[key] = values[key];
  });

  return {
    ...state,
    [action.formName]: form
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function formSubmitting(state, action) {
  const form = objects.merge(state[action.formName], {
    isSubmitting: action.isSubmitting
  });
  if (form.isSubmitting) {
    form.isSubmitted = false;
  }

  return {
    ...state,
    [action.formName]: form
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function formSubmitted(state, action) {
  const form = objects.merge(state[action.formName], {
    isSubmitted:  action.isSubmitted,
    isSubmitting: false
  });

  return {
    ...state,
    [action.formName]: form
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function formError(state, action) {
  const form = objects.merge(state[action.formName], {
    errorMessage:   action.errorMessage,
    errorFields:    objects.clone(action.errorFields),
    successMessage: ''
  });

  form.successMessage = '';
  if (form.errors && action.errors) {
    form.errors = action.errors;
  }
  if (form.successes) {
    form.successes = [];
  }

  return {
    ...state,
    [action.formName]: form
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function formSuccess(state, action) {
  const form = objects.merge(state[action.formName], {
    successMessage: action.successMessage,
    errorMessage:   '',
    errorFields:    {}
  });
  if (form.errors) {
    form.errors = [];
  }
  if (form.successes && action.successes) {
    form.successes = action.successes;
  }

  return {
    ...state,
    [action.formName]: form
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function formReset(state, action) {
  let form = objects.clone(state[action.formName]);

  if (initialState[action.formName]) {
    form = objects.clone(initialState[action.formName]);
  } else {
    Object.keys(form).forEach((key) => {
      switch (typeof form[key]) {
        case 'string':
          form[key] = '';
          break;
        case 'boolean':
          form[key] = false;
          break;
      }
    });
  }

  return {
    ...state,
    [action.formName]: form
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function formComplete(state, action) {
  const form = objects.merge(state[action.formName], {
    isComplete: action.isComplete
  });

  return {
    ...state,
    [action.formName]: form
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
export default function formsReducer(state = initialState, action = {}) {
  switch (action.type) {
    case types.FORMS_CHANGE:
      return formChange(state, action);
    case types.FORMS_CHANGES:
      return formChanges(state, action);
    case types.FORMS_SUBMITTING:
      return formSubmitting(state, action);
    case types.FORMS_SUBMITTED:
      return formSubmitted(state, action);
    case types.FORMS_ERROR:
      return formError(state, action);
    case types.FORMS_SUCCESS:
      return formSuccess(state, action);
    case types.FORMS_RESET:
      return formReset(state, action);
    case types.FORMS_COMPLETE:
      return formComplete(state, action);
    default: return state;
  }
}
