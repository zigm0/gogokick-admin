import React from 'react';
import PropTypes from 'prop-types';
import { strings } from 'utils';

export default class BlockText extends React.PureComponent {
  static propTypes = {
    block: PropTypes.shape({
      text: PropTypes.string
    }).isRequired
  };

  static defaultProps = {};

  /**
   * @returns {*}
   */
  render() {
    const { block } = this.props;

    const text = strings.stripTags(block.text, '<div><b><i><a><h3><ul><li>');

    return (
      <div dangerouslySetInnerHTML={{ __html: text }} />
    );
  }
}
