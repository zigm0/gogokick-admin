import React from 'react';
import PropTypes from 'prop-types';
import { connect, mapDispatchToProps } from 'utils';

const mapStateToProps = state => ({

});

@connect(
  mapStateToProps,
  mapDispatchToProps()
)
export default class EditingBlockText extends React.PureComponent {
  static propTypes = {
    block: PropTypes.object.isRequired
  };

  static defaultProps = {};

  /**
   * @returns {*}
   */
  render() {
    return (
      <div>
        Editing
      </div>
    );
  }
}
