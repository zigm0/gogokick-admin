import React from 'react';
import PropTypes from 'prop-types';
import { connect, mapDispatchToProps } from 'utils';
import { Button } from 'components/bootstrap';
import { Form, Input } from 'components/forms';
import { Modal } from 'components';
import * as userActions from 'actions/userActions';
import * as editorActions from 'actions/editorActions';
import * as formActions from 'actions/formActions';

const mapStateToProps = state => ({
  user: state.user
});

@connect(
  mapStateToProps,
  mapDispatchToProps(userActions, editorActions, formActions)
)
export default class LoginModal extends React.PureComponent {
  static propTypes = {
    user:        PropTypes.object.isRequired,
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
          sm
        />
        <Input
          name="password"
          type="password"
          label="Password"
          id="input-login-password"
          sm
        />
      </Form>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    const { user } = this.props;

    const buttons = (
      <Button onClick={this.handleLoginClick} sm>
        Login
      </Button>
    );

    return (
      <Modal
        name="login"
        title="Login"
        icon="sign-in-alt"
        buttons={buttons}
      >
        {user.error && (
          <div className="alert alert-danger">
            {user.error}
          </div>
        )}
        {this.renderForm()}
      </Modal>
    );
  }
}
