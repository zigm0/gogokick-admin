import React from 'react';
import PropTypes from 'prop-types';
import { connect, constants, mapDispatchToProps, styles } from 'utils';
import { Icon } from 'components';
import { uiActions } from 'actions';

const mapStateToProps = state => ({
  campaignType: state.project.campaignType,
});

@connect(
  mapStateToProps,
  mapDispatchToProps(uiActions)
)
export default class BlockDescription extends React.PureComponent {
  static propTypes = {
    block: PropTypes.shape({
      description: PropTypes.string
    }).isRequired,
    icon:    PropTypes.string.isRequired,
    height:  PropTypes.number,
    uiModal: PropTypes.func.isRequired
  };

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);

    this.wrapper     = React.createRef();
    this.description = React.createRef();

    this.state = {
      overflown: false
    };
  }

  /**
   *
   */
  componentDidMount() {
    this.handleUpdate();
  }

  /**
   * @param {*} prevProps
   */
  componentDidUpdate(prevProps) {
    const { block } = this.props;
    const { block: prevBlock } = prevProps;

    if (block.description !== prevBlock.description) {
      this.handleUpdate();
    }
  }

  /**
   *
   */
  handleUpdate() {
    const { height } = this.props;

    if (!height) {
      return;
    }

    const iconHeight     = 30;
    const dimsHeight     = 30;
    const readMoreHeight = 15;
    const adjustedHeight = height - iconHeight - dimsHeight;

    if (this.description.current.scrollHeight > adjustedHeight) {
      this.description.current.style.height = `${adjustedHeight - readMoreHeight}px`;
      this.setState({ overflown: true });
    }
  }

  /**
   * @param {Event} e
   */
  handleReadClick = (e) => {
    const { block, uiModal } = this.props;

    e.stopPropagation();
    uiModal({
      modal: 'blockSettings',
      open:  true,
      meta:  block
    })
  };

  /**
   * @returns {*}
   */
  render() {
    const { block, icon } = this.props;
    const { overflown } = this.state;

    if (block.description) {
      return (
        <>
          <div className="block-icon-container">
            <Icon name={icon} size={2} />
          </div>
          <div ref={this.description} className="block-description">
            {block.description}
          </div>
          {overflown && (
            <div className="block-empty-read-more" onClick={this.handleReadClick}>
              Read More
            </div>
          )}
        </>
      );
    }

    return (
      <div ref={this.description} className="block-description empty">
        <Icon name={icon} size={2} />
        Description
      </div>
    );
  }
}
