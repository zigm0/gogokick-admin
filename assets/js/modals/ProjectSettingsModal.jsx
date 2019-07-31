import React from 'react';
import PropTypes from 'prop-types';
import { connect, mapDispatchToProps } from 'utils';
import { Button } from 'components/bootstrap';
import { Form, Input } from 'components/forms';
import { Modal } from 'components';
import * as editorActions from 'actions/editorActions';
import * as formActions from 'actions/formActions';

const mapStateToProps = state => ({
  editor: state.editor
});

@connect(
  mapStateToProps,
  mapDispatchToProps(editorActions, formActions)
)
export default class ProjectSettingsModal extends React.PureComponent {
  static propTypes = {
    editor:      PropTypes.object.isRequired,
    editorModal: PropTypes.func.isRequired,
    formChanges: PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   *
   */
  componentDidMount() {
    const { editor, formChanges } = this.props;

    formChanges('projectSettings', {
      name: editor.projectName
    });
  }

  /**
   * @param {*} prevProps
   */
  componentDidUpdate(prevProps) {
    const { editor, formChanges } = this.props;

    if (prevProps.editor.projectName !== editor.projectName) {
      formChanges('projectSettings', {
        name: editor.projectName
      });
    }
  }

  /**
   * @returns {*}
   */
  renderForm = () => {
    return (
      <Form name="projectSettings">
        <Input
          name="name"
          type="text"
          label="Project Name"
          id="input-project-settings-name"
          sm
        />
      </Form>
    );
  };

  /**
   * @param {Event} e
   */
  handleSaveClick = (e) => {
    const { editorModal } = this.props;

    editorModal({
      modal: 'settings',
      open:  false
    });
  };

  /**
   * @returns {*}
   */
  render() {
    const buttons = (
      <Button onClick={this.handleSaveClick} sm>
        Save
      </Button>
    );

    return (
      <Modal
        name="settings"
        title="Settings"
        icon="cog"
        buttons={buttons}
      >
        {this.renderForm()}
      </Modal>
    );
  }
}
