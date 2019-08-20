import React from 'react';
import PropTypes from 'prop-types';
import { connect, system, mapDispatchToProps } from 'utils';
import { Button } from 'components/bootstrap';
import { Modal } from 'components';
import { formActions } from 'actions';

const mapStateToProps = state => ({
  forms:  state.forms,
  editor: state.editor
});

@connect(
  mapStateToProps,
  mapDispatchToProps(formActions)
)
export default class PreviewModal extends React.PureComponent {
  static propTypes = {
    forms:       PropTypes.object.isRequired,
    editor:      PropTypes.object.isRequired,
    formChanges: PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   * @returns {*}
   */
  renderForm = () => {
    return (
      <form>
        <div className="form-group">
          <input
            className="form-control"
            value="https://..."
            readOnly
          />
        </div>
        <div className="form-group btn-spaced-group">
          <Button type="button" theme="secondary" sm>
            Copy to clipboard
          </Button>
          <Button type="button" theme="secondary" sm>
            Open in new window
          </Button>
        </div>
      </form>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    return (
      <Modal
        name="preview"
        title="Preview"
        icon="eye"
      >
        <p>
          Share this link...
        </p>
        {this.renderForm()}
      </Modal>
    );
  }
}
