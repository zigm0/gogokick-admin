import React from 'react';
import PropTypes from 'prop-types';
import { connect, history, mapDispatchToProps } from 'utils';
import { Form, Input } from 'components/forms';
import { Container, Row, Column, Card, CardHeader, CardBody, Button } from 'components/bootstrap';
import { userActions } from 'actions';

const mapStateToProps = state => ({
  isAuthenticated: state.user.isAuthenticated
});

@connect(
  mapStateToProps,
  mapDispatchToProps(userActions)
)
export default class Register extends React.PureComponent {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    userRegister:    PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   *
   */
  componentDidMount() {
    const { isAuthenticated } = this.props;

    if (isAuthenticated) {
      history.push('/dashboard');
    }
  }

  /**
   * @param {Event} e
   */
  handleSubmit = (e) => {
    const { userRegister } = this.props;

    e.preventDefault();

    userRegister();
  };

  /**
   * @returns {*}
   */
  render() {
    return (
      <Container className="gutter-top-lg">
        <Row>
          <Column xl={6} offsetXl={3}>
            <Card>
              <CardHeader>
                Register
              </CardHeader>
              <CardBody>
                <Form name="register" onSubmit={this.handleSubmit}>
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
                  <div>
                    <Button>
                      Register
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Column>
        </Row>
      </Container>
    );
  }
}
