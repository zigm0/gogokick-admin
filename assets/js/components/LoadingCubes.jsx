import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class LoadingCubes extends React.PureComponent {
  static propTypes = {
    middle: PropTypes.bool,
  };

  static defaultProps = {
    middle: true
  };

  /**
   * @returns {*}
   */
  render() {
    const { middle } = this.props;

    const classes = classNames('loading-cube', {
      'middle': middle
    });

    return (
      <div className={classes}>
        <div className="loading-cube-inner" style={{ width: '100%', height: '100%' }}>
          <div />
          <div />
          <div />
          <div />
        </div>
      </div>
    );
  }
}
