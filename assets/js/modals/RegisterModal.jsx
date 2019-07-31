import React from 'react';
import PropTypes from 'prop-types';
import { connect, mapDispatchToProps } from 'utils';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'components/bootstrap';
import { Form, Input } from 'components/forms';
import { Icon } from 'components';
import * as userActions from 'actions/userActions';
import * as editorActions from 'actions/editorActions';
import * as formActions from 'actions/formActions';

const mapStateToProps = state => ({
  modals: state.editor.modals,
  user:   state.user
});

@connect(
  mapStateToProps,
  mapDispatchToProps(userActions, editorActions, formActions)
)
export default class RegisterModal extends React.PureComponent {
  static propTypes = {
    user:         PropTypes.object.isRequired,
    modals:       PropTypes.object.isRequired,
    userLogin:    PropTypes.func.isRequired,
    userRegister: PropTypes.func.isRequired,
    editorModal:  PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   * @param {*} prevProps
   */
  componentDidUpdate(prevProps) {
    const { user, editorModal } = this.props;

    if (!prevProps.user.isAuthenticated && user.isAuthenticated) {
      editorModal({
        modal: 'register',
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
      modal: 'register',
      open:  false
    });
  };

  /**
   * @param {Event} e
   */
  handleLoginSubmit = (e) => {
    const { userLogin } = this.props;

    e.preventDefault();

    userLogin();
  };

  /**
   * @param {Event} e
   */
  handleRegisterSubmit = (e) => {
    const { userRegister } = this.props;

    e.preventDefault();

    userRegister();
  };

  /**
   * @returns {*}
   */
  renderLoginForm = () => {
    return (
      <Form name="login" className="gutter-bottom" onSubmit={this.handleLoginSubmit}>
        <Input
          name="email"
          type="text"
          label="Email"
          id="input-login-email"
          sm
        />
        <Input
          name="password"
          type="password"
          label="Password"
          id="input-login-password"
          sm
        />
        <div className="text-right">
          <Button type="submit" sm>Login</Button>
        </div>
      </Form>
    );
  };

  /**
   * @returns {*}
   */
  renderRegistrationForm = () => {
    return (
      <Form name="register" onSubmit={this.handleRegisterSubmit}>
        <h5 className="gutter-bottom-sm">
          Don't have an account yet?
        </h5>
        <Input
          name="name"
          type="text"
          label="Name"
          id="input-register-name"
          sm
        />
        <Input
          name="email"
          type="text"
          label="Email"
          id="input-register-email"
          sm
        />
        <Input
          name="password"
          type="password"
          label="Password"
          id="input-register-password"
          sm
        />
        <div className="text-right">
          <Button type="submit" sm>Register</Button>
        </div>
      </Form>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    const { user, modals } = this.props;

    return (
      <Modal open={modals.register} onClosed={this.handleClosed}>
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
          {this.renderLoginForm()}
          {this.renderRegistrationForm()}
        </ModalBody>
      </Modal>
    );
  }
}
