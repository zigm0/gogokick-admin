import React from 'react';
import PropTypes from 'prop-types';
import { connect, mapDispatchToProps } from 'utils';
import Canvas from 'editor/Canvas';

const mapStateToProps = state => ({});

@connect(
  mapStateToProps,
  mapDispatchToProps()
)
export default class EditorBody extends React.PureComponent {
  static propTypes = {};

  /**
   * @returns {*}
   */
  render() {
    return (
      <Canvas />
    );
  }
}
