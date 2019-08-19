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

    let __html = strings.stripTags(block.text, '<div><p><b><i><a><h3><br><ul><li>');
    if (block.isHeadline) {
      __html = `<h3>${__html}</h3>`;
    }

    return (
      <div dangerouslySetInnerHTML={{ __html }} />
    );
  }
}
