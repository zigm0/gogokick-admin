import 'polyfills';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from 'store/configureStore';
import Editor from 'Editor';

ReactDOM.render(
  <Provider store={configureStore()}>
    <Editor />
  </Provider>,
  document.getElementById('mount')
);
