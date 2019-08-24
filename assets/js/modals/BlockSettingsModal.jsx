import React from 'react';
import PropTypes from 'prop-types';
import { connect, objects, mapDispatchToProps } from 'utils';
import { Modal } from 'components';
import { Form, Textarea, Input } from 'components/forms';
import { Row, Column } from 'components/bootstrap';
import { formActions, editorActions } from 'actions';

const mapStateToProps = state => ({
  blockSettings: state.forms.blockSettings,
  block:         state.ui.modalMeta.blockSettings
});

@connect(
  mapStateToProps,
  mapDispatchToProps(editorActions, formActions)
)
export default class BlockSettingsModal extends React.PureComponent {
  static propTypes = {
    blockSettings: PropTypes.object.isRequired,
    block:         PropTypes.object,
    editorChange:  PropTypes.func.isRequired,
    formChanges:   PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   * @param {*} prevProps
   */
  componentDidUpdate(prevProps) {
    const { block, formChanges } = this.props;
    const { block: prevBlock } = prevProps;

    if ((block && !prevBlock) || (block && block.id !== prevBlock.id)) {
      formChanges('blockSettings', {
        description: block.description || 'Description',
        width:       '0',
        height:      '0'
      });
    }
  }

  /**
   *
   */
  handleClosed = () => {
    const { block, blockSettings, editorChange } = this.props;

    editorChange(objects.merge(block, {
      description: blockSettings.description
    }));
  };

  /**
   * @returns {*}
   */
  renderForm = () => {
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
