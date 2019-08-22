import React from 'react';
import PropTypes from 'prop-types';
import { connect, mapDispatchToProps } from 'utils';
import { Button } from 'components/bootstrap';
import { Form, Input } from 'components/forms';
import { Modal } from 'components';
import { formActions, userActions, uiActions } from 'actions';

const mapStateToProps = state => ({
  user: state.user
});

@connect(
  mapStateToProps,
  mapDispatchToProps(userActions, uiActions, formActions)
)
export default class LoginModal extends React.PureComponent {
  static propTypes = {
    user:      PropTypes.object.isRequired,
    userLogin: PropTypes.func.isRequired,
    uiModal:   PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   * @param {*} prevProps
   */
  componentDidUpdate(prevProps) {
    const { user, uiModal } = this.props;

    if (!prevProps.user.isAuthenticated && user.isAuthenticated) {
      uiModal({
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
      <Button onClick={this.handleLoginClick}>
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
