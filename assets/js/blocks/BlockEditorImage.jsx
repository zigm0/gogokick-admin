import React from 'react';
import PropTypes from 'prop-types';
import { connect, mapDispatchToProps } from 'utils';

const mapStateToProps = state => ({

});

@connect(
  mapStateToProps,
  mapDispatchToProps()
)
export default class BlockEditorImage extends React.PureComponent {
  static propTypes = {};

  static defaultProps = {};

  /**
   * @returns {*}
   */
  render() {
    return (
      <div>
        Not implemented yet
      </div>
    );
  }
}
