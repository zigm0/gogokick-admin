import React from 'react';

export default class NotFound extends React.PureComponent {
  /**
   * @returns {*}
   */
  render() {
    return (
      <div className="error-not-found text-center">
        <h1>404</h1>
        <div>Not Found</div>
      </div>
    );
  }
}
