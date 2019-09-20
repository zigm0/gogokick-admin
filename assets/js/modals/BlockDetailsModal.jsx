import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect, constants, styles, mapDispatchToProps } from 'utils';
import { Row, Column, Modal, ModalBody, ModalFooter, Button } from 'components/bootstrap';
import { uiActions } from 'actions';

const mapStateToProps = state => ({
  modals:       state.ui.modals,
  block:        state.ui.modalMeta.blockDetails,
  campaignType: state.project.campaignType
});

@connect(
  mapStateToProps,
  mapDispatchToProps(uiActions)
)
export default class BlockDetailsModal extends React.PureComponent {
  static propTypes = {
    block:        PropTypes.object,
    modals:       PropTypes.object.isRequired,
    campaignType: PropTypes.number.isRequired,
    uiModal:      PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   *
   */
  handleClosed = () => {
    const { uiModal } = this.props;

    uiModal({
      modal: 'blockDetails',
      open:  false
    });
  };

  /**
   * @returns {*}
   */
  renderFormText = () => {
    const { block } = this.props;

    return (
      <>
        <Row>
          <Column className="marginless" xl={6} sm={12}>
            <div className="form-group">
              <label>Estimated Word Count (EWC)</label>
              <div className="form-control">
                {block.wordCount}
              </div>
            </div>
          </Column>
        </Row>
        <div className="form-control modal-block-settings-input-description">
          {block.description || 'Description'}
        </div>
      </>
    );
  };

  /**
   * @returns {*}
   */
  renderFormImage = () => {
    const { block, campaignType } = this.props;

    const height     = block.height || styles.heights.blocks[campaignType][block.type];
    const inputValue = (height !== 383 && height !== 510 && height !== 680 && height !== 910) ? height : '';
    const classes    = 'badge badge-primary badge-read-only form-control';

    return (
      <>
        <Row>
          <Column className="marginless" xl={2} sm={12}>
            <div className="form-group">
              <label>Height</label>
              <div className={classNames(classes, { 'badge-block-image': height === 383 })}>
                383
              </div>
            </div>
          </Column>
          <Column className="marginless" xl={2} sm={12}>
            <div className="form-group">
              <label>&nbsp;</label>
              <div className={classNames(classes, { 'badge-block-image': height === 510 })}>
                510
              </div>
            </div>
          </Column>
          <Column className="marginless" xl={2} sm={12}>
            <div className="form-group">
              <label>&nbsp;</label>
              <div className={classNames(classes, { 'badge-block-image': height === 680 })}>
                680
              </div>
            </div>
          </Column>
          <Column className="marginless" xl={2} sm={12}>
            <div className="form-group">
              <label>&nbsp;</label>
              <div className={classNames(classes, { 'badge-block-image': height === 910 })}>
                910
              </div>
            </div>
          </Column>
          <Column className="marginless" xl={4} sm={12}>
            <div className="form-group">
              <label htmlFor="input-block-settings-height">
                Custom Height
              </label>
              <div className="form-control">
                {inputValue}
              </div>
            </div>
          </Column>
        </Row>
        <div className="form-control modal-block-settings-input-description">
          {block.description || 'Description'}
        </div>
      </>
    );
  };

  /**
   * @returns {*}
   */
  renderFormVideo = () => {
    const { block } = this.props;
    const { aspectRatio } = block;

    const classes = 'badge badge-primary badge-read-only form-control';

    return (
      <>
        <label>Aspect Ratio</label>
        <Row>
          <Column className="marginless" xl={2} sm={12}>
            <div className="form-group">
              <div className={classNames(classes, { 'badge-block-video': aspectRatio === '16:9' })}>
                16:9
              </div>
            </div>
          </Column>
          <Column className="marginless" xl={2} sm={12}>
            <div className="form-group">
              <div className={classNames(classes, { 'badge-block-video': aspectRatio === '4:3' })}>
                4:3
              </div>
            </div>
          </Column>
          <Column className="marginless" xl={2} sm={12}>
            <div className="form-group">
              <div className={classNames(classes, { 'badge-block-video': aspectRatio === '1:1' })}>
                1:1
              </div>
            </div>
          </Column>
        </Row>
        <div className="form-control modal-block-settings-input-description">
          {block.description || 'Description'}
        </div>
      </>
    );
  };

  /**
   * @returns {*}
   */
  renderFormAudio = () => {
    const { block } = this.props;

    return (
      <div className="form-control modal-block-settings-input-description">
        {block.description || 'Description'}
      </div>
    );
  };

  /**
   * @returns {*}
   */
  renderForm = () => {
    const { block } = this.props;

    switch (block.type) {
      case constants.blockType('text'):
        return this.renderFormText();
      case constants.blockType('image'):
        return this.renderFormImage();
      case constants.blockType('video'):
        return this.renderFormVideo();
      case constants.blockType('audio'):
        return this.renderFormAudio();
    }
  };

  /**
   * @returns {*}
   */
  render() {
    const { block, modals } = this.props;

    if (!modals.blockDetails) {
      return null;
    }

    const blockType = constants.blockType(block.type);

    return (
      <Modal
        className={`modal-block-settings modal-block-settings-${blockType}`}
        closeable={false}
        open
        lg
      >
        <ModalBody>
          {this.renderForm()}
        </ModalBody>
        <ModalFooter>
          <Button onClick={this.handleClosed} sm>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
