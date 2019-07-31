import React from 'react';
import PropTypes from 'prop-types';
import { connect, mapDispatchToProps } from 'utils';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'components/bootstrap';
import { Form, Input } from 'components/forms';
import * as userActions from 'actions/userActions';
import * as editorActions from 'actions/editorActions';
import * as formActions from 'actions/formActions';
import { Icon } from "../components";

const mapStateToProps = state => ({
  modals: state.editor.modals,
  user:   state.user
});

@connect(
  mapStateToProps,
  mapDispatchToProps(userActions, editorActions, formActions)
)
export default class LoginModal extends React.PureComponent {
  static propTypes = {
    user:        PropTypes.object.isRequired,
    modals:      PropTypes.object.isRequired,
    userLogin:   PropTypes.func.isRequired,
    editorModal: PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   * @param {*} prevProps
   */
  componentDidUpdate(prevProps) {
    const { user, editorModal } = this.props;

    if (!prevProps.user.isAuthenticated && user.isAuthenticated) {
      editorModal({
        modal: 'login',
        open:  false
      });
    }
  }

  /**
   *
   */
  handleClosed = () => {
    const { editorModal } = this.props;

    editorModal({
      modal: 'login',
      open:  false
    });
  };

  /**
   *
   */
  handleLoginClick = () => {
    const { userLogin } = this.props;

    userLogin();
  };

  /**
   * @returns {*}
   */
  renderForm = () => {
    return (
      <Form name="login">
        <Input
          name="email"
          type="text"
          label="Email"
          id="input-login-email"
        />
        <Input
          name="password"
          type="password"
          label="Password"
          id="input-login-password"
        />
      </Form>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    const { user, modals } = this.props;

    return (
      <Modal open={modals.login} onClosed={this.handleClosed}>
        <ModalHeader>
          <Icon name="sign-in-alt" />
          Login
        </ModalHeader>
        <ModalBody>
          {user.error && (
            <div className="alert alert-danger">
              {user.error}
            </div>
          )}
          {this.renderForm()}
        </ModalBody>
        <ModalFooter>
          <Button onClick={this.handleLoginClick} sm>
            Login
          </Button>
          <Button onClick={this.handleClosed} sm>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
