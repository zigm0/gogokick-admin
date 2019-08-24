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
      formChanges('blockSettings', {
        description: block.description || 'Description',
        width:       block.width || styles.widths.blocks[campaignType],
        height:      block.height || styles.heights.blocks[campaignType][block.type]
      });
    }
  }

  /**
   *
   */
  handleClosed = () => {
    const { block, blockSettings, editorBlockSettings } = this.props;

    editorBlockSettings(objects.merge(block, {
      description: blockSettings.description,
      width:       parseInt(blockSettings.width || 0, 10),
      height:      parseInt(blockSettings.height || 0, 10)
    }));
  };

  /**
   * @returns {*}
   */
  renderForm = () => {
    const { block } = this.props;
    console.log(block.type);
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
              readOnly={constants.blockType(block.type) !== 'image'}
            />
          </Column>
          <Column xl={6} sm={12}>
            <Input
              name="height"
              label="Height"
              id="input-block-settings-height"
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
