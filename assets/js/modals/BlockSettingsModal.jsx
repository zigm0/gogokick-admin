import React from 'react';
import PropTypes from 'prop-types';
import { connect, objects, constants, styles, mapDispatchToProps } from 'utils';
import { Modal } from 'components';
import { Form, Textarea, Input } from 'components/forms';
import { Row, Column } from 'components/bootstrap';
import { formActions, editorActions } from 'actions';

const mapStateToProps = state => ({
  block:         state.ui.modalMeta.blockSettings,
  blockSettings: state.forms.blockSettings,
  campaignType:  state.project.campaignType,
});

@connect(
  mapStateToProps,
  mapDispatchToProps(editorActions, formActions)
)
export default class BlockSettingsModal extends React.PureComponent {
  static propTypes = {
    block:               PropTypes.object,
    blockSettings:       PropTypes.object.isRequired,
    campaignType:        PropTypes.number.isRequired,
    editorBlockSettings: PropTypes.func.isRequired,
    formChanges:         PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   * @param {*} prevProps
   */
  componentDidUpdate(prevProps) {
    const { block, campaignType, formChanges } = this.props;
    const { block: prevBlock } = prevProps;

    if ((block && !prevBlock) || (block && block.id !== prevBlock.id)) {
      const width  = block.width || styles.widths.blocks[campaignType];
      const height = block.height || styles.heights.blocks[campaignType][block.type];

      formChanges('blockSettings', {
        description: block.description || 'Description',
        width,
        height
      });
    }
  }

  /**
   *
   */
  handleClosed = () => {
    const { block, blockSettings, campaignType, formChanges, editorBlockSettings } = this.props;

    let width = parseInt(blockSettings.width || styles.widths.blocks[campaignType], 10);
    if (width > styles.widths.blocks[campaignType]) {
      width = styles.widths.blocks[campaignType];
    }
    const height = parseInt(blockSettings.height || styles.heights.blocks[campaignType][block.type], 10);

    editorBlockSettings(objects.merge(block, {
      description: blockSettings.description,
      width,
      height
    }));
    formChanges('blockSettings', {
      description: block.description || 'Description',
      width,
      height
    });
  };

  /**
   * @returns {*}
   */
  renderForm = () => {
    const { block } = this.props;

    const bt = constants.blockType(block.type);

    return (
      <Form name="blockSettings">
        <Textarea
          name="description"
          label="Description"
          id="input-block-settings-description"
        />
        <Row>
          <Column xl={6} sm={12}>
            <Input
              name="width"
              label="Width"
              id="input-block-settings-width"
              readOnly={bt !== 'image'}
            />
          </Column>
          <Column xl={6} sm={12}>
            <Input
              name="height"
              label="Height"
              id="input-block-settings-height"
              readOnly={bt === 'video' || bt === 'audio'}
            />
          </Column>
        </Row>
      </Form>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    const { block } = this.props;

    if (!block) {
      return null;
    }

    return (
      <Modal
        name="blockSettings"
        title="Block Settings"
        onClosed={this.handleClosed}
      >
        {this.renderForm()}
      </Modal>
    );
  }
}
