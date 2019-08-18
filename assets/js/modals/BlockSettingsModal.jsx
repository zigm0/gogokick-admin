import React from 'react';
import PropTypes from 'prop-types';
import { connect, objects, mapDispatchToProps } from 'utils';
import { Button } from 'components/bootstrap';
import { Modal } from 'components';
import { Form, Textarea } from 'components/forms';
import * as editorActions from 'actions/editorActions';
import * as formActions from 'actions/formActions';

const mapStateToProps = state => ({
  blockSettings: state.forms.blockSettings,
  block:         state.editor.modalMeta
});

@connect(
  mapStateToProps,
  mapDispatchToProps(editorActions, formActions)
)
export default class BlockSettingsModal extends React.PureComponent {
  static propTypes = {
    blockSettings: PropTypes.object.isRequired,
    block:         PropTypes.object,
    editorModal:   PropTypes.func.isRequired,
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
        description: block.description || 'Description'
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
        icon="cog"
        onClosed={this.handleClosed}
      >
        {this.renderForm()}
      </Modal>
    );
  }
}
