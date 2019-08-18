import React from 'react';
import PropTypes from 'prop-types';
import { connect, mapDispatchToProps } from 'utils';

const mapStateToProps = state => ({

});

@connect(
  mapStateToProps,
  mapDispatchToProps()
)
export default class BlockImage extends React.PureComponent {
  static propTypes = {
    block: PropTypes.shape({
      image: PropTypes.object
    }).isRequired
  };

  static defaultProps = {};

  /**
   * @returns {*}
   */
  render() {
    const { block } = this.props;

    return (
      <img src={block.image.url} alt="" />
    );
  }
}
