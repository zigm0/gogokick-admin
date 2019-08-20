import React from 'react';
import PropTypes from 'prop-types';

export default class BlockImage extends React.PureComponent {
  static propTypes = {
    block: PropTypes.shape({
      media:   PropTypes.object,
      caption: PropTypes.string
    }).isRequired
  };

  static defaultProps = {};

  /**
   * @returns {*}
   */
  render() {
    const { block } = this.props;

    return (
      <figure>
        <img src={block.media.url} alt="" />
        {block.caption && (
          <figcaption className="px2">{block.caption}</figcaption>
        )}
      </figure>
    );
  }
}
