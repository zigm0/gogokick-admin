import React from 'react';
import PropTypes from 'prop-types';
import { strings } from 'utils';

export default class BlockText extends React.PureComponent {
  static propTypes = {
    block: PropTypes.shape({
      text:       PropTypes.string.isRequired,
      isHeadline: PropTypes.bool
    }).isRequired
  };

  static defaultProps = {};

  /**
   * @returns {*}
   */
  render() {
    const { block } = this.props;

    let __html = strings.stripTags(block.text, '<div><p><b><i><a><br><ul><li>');
    if (block.isHeadline) {
      __html = `<h1>${__html}</h1>`;
    }

    return (
      <div className="hyphenate" dangerouslySetInnerHTML={{ __html }} />
    );
  }
}
