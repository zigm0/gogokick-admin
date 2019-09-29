import React from 'react';
import PropTypes from 'prop-types';
import { connect, campaigns } from 'utils';

const mapStateToProps = state => ({
  campaignType: state.project.campaignType
});

@connect(
  mapStateToProps
)
export default class BlockText extends React.PureComponent {
  static propTypes = {
    block: PropTypes.shape({
      text:       PropTypes.string.isRequired,
      isHeadline: PropTypes.bool
    }).isRequired,
    campaignType: PropTypes.number.isRequired,
  };

  static defaultProps = {};

  /**
   * @returns {*}
   */
  render() {
    const { block, campaignType } = this.props;

    let __html = campaigns.stripHTML(campaignType, block.text);
    if (block.isHeadline) {
      __html = `<h1>${__html}</h1>`;
    }

    return (
      <div className="hyphenate" dangerouslySetInnerHTML={{ __html }} />
    );
  }
}
