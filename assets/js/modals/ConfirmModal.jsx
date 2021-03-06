import React from 'react';
import { Button } from 'components/bootstrap';

export default class ConfirmModal extends React.PureComponent {
  /**
   * @returns {*}
   */
  render() {
    return (
      <div
        id="modal-confirm"
        className="modal"
        tabIndex="-1"
        role="dialog"
        data-backdrop="static"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <span className="modal-body-label" />
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
