import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { connect, history, mapDispatchToProps } from 'utils';
import { Form, Input } from 'components/forms';
import { Link } from 'components';
import { Container, Row, Column, Card, CardHeader, CardBody, Button } from 'components/bootstrap';
import { userActions } from 'actions';

const mapStateToProps = state => ({
  isAuthenticated: state.user.isAuthenticated
});

@connect(
  mapStateToProps,
  mapDispatchToProps(userActions)
)
export default class Login extends React.PureComponent {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    userLogin:       PropTypes.func.isRequired
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
    const { userLogin } = this.props;

    e.preventDefault();
    userLogin();
  };

  /**
   * @returns {*}
   */
  render() {
    let registerUrl = '/register';
    const parsed = queryString.parse(document.location.search);
    if (parsed.back) {
      registerUrl = `${registerUrl}?back=${parsed.back}`;
    }

    return (
      <Container className="gutter-top-lg">
        <Row>
          <Column xl={6} offsetXl={3}>
            <Card>
              <CardHeader>
                Login
              </CardHeader>
              <CardBody>
                <Form name="login" onSubmit={this.handleSubmit}>
                  <Input
                    name="email"
                    type="text"
                    label="Email"
                    id="input-login-email"
                    focused
                    sm
                  />
                  <Input
                    name="password"
                    type="password"
                    label="Password"
                    id="input-login-password"
                    sm
                  />
                  <div>
                    <Button className="margin-right-sm">
                      Login
                    </Button>
                    <Link to={registerUrl} className="btn btn-primary">
                      Register
                    </Link>
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
