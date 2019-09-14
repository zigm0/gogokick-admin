import React from 'react';
import PropTypes from 'prop-types';

export default class ErrorBoundary extends React.Component {
  static propTypes = {
    children: PropTypes.node
  };

  constructor(props) {
    super(props);
    this.state = {
      error: null
    };
  }

  /**
   * @param {*} error
   * @returns {{error: *}}
   */
  static getDerivedStateFromError(error) {
    return { error };
  }

  /**
   * @param {*} error
   * @param {*} errorInfo
   */
  componentDidCatch(error, errorInfo) {
    console.log(errorInfo);
  }

  /**
   * @returns {*}
   */
  render() {
    const { children } = this.props;
    const { error } = this.state;

    if (error) {
      return (
        <div className="error-boundary-message">
          <h1>
            <i className="fa fa-exclamation-triangle margin-right-sm" />
            Something went wrong.
          </h1>
          {__DEV__ && (
            <p>{error.toString()}</p>
          )}
        </div>
      );
    }

    return children;
  }
}
