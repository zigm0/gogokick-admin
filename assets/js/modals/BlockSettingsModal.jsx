import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect, objects, constants, styles, acl, mapDispatchToProps } from 'utils';
import { Row, Column, Modal, ModalBody, ModalFooter, Button } from 'components/bootstrap';
import { Form, Textarea, Input } from 'components/forms';
import { formActions, editorActions, uiActions } from 'actions';

const descriptionMaxLength = 1000;

const mapStateToProps = state => ({
  modals:        state.ui.modals,
  block:         state.ui.modalMeta.blockSettings,
  blockSettings: state.forms.blockSettings,
  campaignType:  state.project.campaignType,
  meTeamMember:  state.editor.meTeamMember
});

@connect(
  mapStateToProps,
  mapDispatchToProps(editorActions, formActions, uiActions)
)
export default class BlockSettingsModal extends React.PureComponent {
  static propTypes = {
    block:               PropTypes.object,
    modals:              PropTypes.object.isRequired,
    meTeamMember:        PropTypes.object.isRequired,
    blockSettings:       PropTypes.object.isRequired,
    campaignType:        PropTypes.number.isRequired,
    editorBlockSettings: PropTypes.func.isRequired,
    formChange:          PropTypes.func.isRequired,
    formChanges:         PropTypes.func.isRequired,
    uiModal:             PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   * @param {*} prevProps
   */
  componentDidUpdate(prevProps) {
    const { block, campaignType, formChanges, modals } = this.props;
    const { block: prevBlock, modals: prevModals } = prevProps;

    if (
      (block && !prevBlock)
      || (block && block.id !== prevBlock.id)
      || (block && modals.blockSettings !== prevModals.blockSettings))
    {
      const width  = block.width || styles.widths.blocks[campaignType];
      const height = block.height || styles.heights.blocks[campaignType][block.type];

      formChanges('blockSettings', {
        description: block.description || '',
        wordCount:   block.wordCount,
        aspectRatio: block.aspectRatio,
        width,
        height
      });
    }
  }

  /**
   *
   */
  handleClosed = () => {
    const { uiModal } = this.props;

    uiModal({
      modal: 'blockSettings',
      open:  false
    });
  };

  /**
   *
   */
  handleSave = () => {
    const { block, blockSettings, campaignType, formChanges, editorBlockSettings } = this.props;

    let width = parseInt(blockSettings.width || styles.widths.blocks[campaignType], 10);
    if (width > styles.widths.blocks[campaignType]) {
      width = styles.widths.blocks[campaignType];
    }
    const height = parseInt(blockSettings.height || styles.heights.blocks[campaignType][block.type], 10);

    editorBlockSettings(objects.merge(block, {
      description: blockSettings.description || '',
      wordCount:   parseInt(blockSettings.wordCount, 10),
      aspectRatio: blockSettings.aspectRatio,
      width,
      height
    }));

    formChanges('blockSettings', {
      description: blockSettings.description || '',
      wordCount:   parseInt(blockSettings.wordCount, 10),
      aspectRatio: blockSettings.aspectRatio,
      width,
      height
    });

    this.handleClosed();
  };

  /**
   * @param {Event} e
   * @param {number|string} height
   */
  handleHeightChange = (e, height) => {
    const { formChange, meTeamMember } = this.props;
    const { roles } = meTeamMember;

    if (acl(roles, 'settings', 'blocks')) {
      formChange('blockSettings', 'height', height);
    }
  };

  /**
   * @param {Event} e
   * @param {string} aspectRatio
   */
  handleAspectRatioChange = (e, aspectRatio) => {
    const { formChange, meTeamMember } = this.props;
    const { roles } = meTeamMember;

    if (acl(roles, 'settings', 'blocks')) {
      formChange('blockSettings', 'aspectRatio', aspectRatio);
    }
  };

  /**
   * @returns {*}
   */
  renderFormText = () => {
    const { meTeamMember } = this.props;
    const { roles } = meTeamMember;

    return (
      <Form name="blockSettings">
        <Row>
          <Column className="marginless" xl={6} sm={12}>
            <Input
              name="wordCount"
              label="Estimated Word Count (EWC)"
              id="input-block-settings-ewc"
              readOnly={!acl(roles, 'settings', 'blocks')}
              focused
            />
          </Column>
        </Row>
        <Textarea
          name="description"
          label="Description"
          id="input-block-settings-description"
          placeholder="Type a description for this block."
          className="modal-block-settings-input-description"
          formGroupClassName="marginless"
          readOnly={!acl(roles, 'settings', 'blocks')}
          maxLength={descriptionMaxLength}
          counter
        />
      </Form>
    );
  };

  /**
   * @returns {*}
   */
  renderFormImage = () => {
    const { blockSettings, meTeamMember } = this.props;
    const { roles } = meTeamMember;

    const height     = parseInt(blockSettings.height, 10) || '';
    const inputValue = (height !== 383 && height !== 510 && height !== 680 && height !== 910) ? height : '';
    const classes    = 'badge badge-primary form-control';

    return (
      <Form name="blockSettings">
        <Row>
          <Column className="marginless" xl={2} sm={12}>
            <div className="form-group">
              <label>Height</label>
              <div
                onClick={e => this.handleHeightChange(e, 383)}
                className={classNames(classes, { 'badge-block-image': height === 383 })}
              >
                383
              </div>
            </div>
          </Column>
          <Column className="marginless" xl={2} sm={12}>
            <div className="form-group">
              <label>&nbsp;</label>
              <div
                onClick={e => this.handleHeightChange(e, 510)}
                className={classNames(classes, { 'badge-block-image': height === 510 })}
              >
                510
              </div>
            </div>
          </Column>
          <Column className="marginless" xl={2} sm={12}>
            <div className="form-group">
              <label>&nbsp;</label>
              <div
                onClick={e => this.handleHeightChange(e, 680)}
                className={classNames(classes, { 'badge-block-image': height === 680 })}
              >
                680
              </div>
            </div>
          </Column>
          <Column className="marginless" xl={2} sm={12}>
            <div className="form-group">
              <label>&nbsp;</label>
              <div
                onClick={e => this.handleHeightChange(e, 910)}
                className={classNames(classes, { 'badge-block-image': height === 910 })}
              >
                910
              </div>
            </div>
          </Column>
          <Column className="marginless" xl={4} sm={12}>
            <div className="form-group">
              <label htmlFor="input-block-settings-height">
                Custom Height
              </label>
              <input
                value={inputValue}
                className="form-control"
                id="input-block-settings-height"
                onChange={e => this.handleHeightChange(e, e.target.value)}
                readOnly={!acl(roles, 'settings', 'blocks')}
              />
            </div>
          </Column>
        </Row>
        <Textarea
          name="description"
          label="Description"
          id="input-block-settings-description"
          placeholder="Type a description for this block."
          className="modal-block-settings-input-description"
          formGroupClassName="marginless"
          readOnly={!acl(roles, 'settings', 'blocks')}
          maxLength={descriptionMaxLength}
          counter
          focused
        />
      </Form>
    );
  };

  /**
   * @returns {*}
   */
  renderFormVideo = () => {
    const { blockSettings, meTeamMember } = this.props;
    const { aspectRatio } = blockSettings;
    const { roles } = meTeamMember;

    const classes = 'badge badge-primary form-control';

    return (
      <Form name="blockSettings">
        <label>Aspect Ratio</label>
        <Row>
          <Column className="marginless" xl={2} sm={12}>
            <div className="form-group">
              <div
                onClick={e => this.handleAspectRatioChange(e, '16:9')}
                className={classNames(classes, { 'badge-block-video': aspectRatio === '16:9' })}
              >
                16:9
              </div>
            </div>
          </Column>
          <Column className="marginless" xl={2} sm={12}>
            <div className="form-group">
              <div
                onClick={e => this.handleAspectRatioChange(e, '4:3')}
                className={classNames(classes, { 'badge-block-video': aspectRatio === '4:3' })}
              >
                4:3
              </div>
            </div>
          </Column>
          <Column className="marginless" xl={2} sm={12}>
            <div className="form-group">
              <div
                onClick={e => this.handleAspectRatioChange(e, '1:1')}
                className={classNames(classes, { 'badge-block-video': aspectRatio === '1:1' })}
              >
                1:1
              </div>
            </div>
          </Column>
        </Row>
        <Textarea
          name="description"
          label="Description"
          id="input-block-settings-description"
          placeholder="Type a description for this block."
          className="modal-block-settings-input-description"
          formGroupClassName="marginless"
          readOnly={!acl(roles, 'settings', 'blocks')}
          maxLength={descriptionMaxLength}
          counter
          focused
        />
      </Form>
    );
  };

  /**
   * @returns {*}
   */
  renderFormAudio = () => {
    const { meTeamMember } = this.props;
    const { roles } = meTeamMember;

    return (
      <Form name="blockSettings">
        <Textarea
          name="description"
          label="Description"
          id="input-block-settings-description"
          placeholder="Type a description for this block."
          className="modal-block-settings-input-description"
          formGroupClassName="marginless"
          readOnly={!acl(roles, 'settings', 'blocks')}
          maxLength={descriptionMaxLength}
          counter
          focused
        />
      </Form>
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
    const { block, modals, meTeamMember } = this.props;

    if (!modals.blockSettings || !meTeamMember) {
      return null;
    }

    const { roles } = meTeamMember;
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
          {acl(roles, 'settings', 'blocks') && (
            <Button theme={`block-${blockType}`} onClick={this.handleSave} sm>
              Save
            </Button>
          )}
          <Button onClick={this.handleClosed} sm>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
