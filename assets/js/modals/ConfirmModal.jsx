import React from 'react';
import { Button } from 'components/bootstrap';
import { Form, Input } from 'components/forms';

export default class ConfirmModal extends React.PureComponent {
  /**
   * @returns {*}
   */
  renderForm = () => {
    return (
      <Form name="confirm">
        <Input
          name="input"
          type="text"
          label="label"
          id="input-confirm-input"
          sm
        />
      </Form>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    return (
      <div
        id="confirm-modal"
        className="modal fade"
        tabIndex="-1"
        role="dialog"
        data-backdrop="static"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              {this.renderForm()}
            </div>
            <div className="modal-footer">
              <Button className="modal-footer-btn-okay" sm>Okay</Button>
              <Button className="modal-footer-btn-cancel" sm>Cancel</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
