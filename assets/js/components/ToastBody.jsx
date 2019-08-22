import React from 'react';
import PropTypes from 'prop-types';
import { connect, mapDispatchToProps } from 'utils';

const mapStateToProps = state => ({

});

@connect(
  mapStateToProps,
  mapDispatchToProps()
)
export default class ToastBody extends React.PureComponent {
  static propTypes = {
    type:    PropTypes.string.isRequired,
    message: PropTypes.string.isRequired
  };

  static defaultProps = {};

  /**
   * @returns {*}
   */
  render() {
    const { type, message } = this.props;

    return (
      <div className={`toast-${type}`}>
        {message}
      </div>
    );
  }
}
