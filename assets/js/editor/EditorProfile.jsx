import React from 'react';
import PropTypes from 'prop-types';
import { connect, browser, mapDispatchToProps } from 'utils';
import { Container, Row, Column } from 'components/bootstrap';
import { Avatar } from 'components';

const mapStateToProps = state => ({
  user: state.user
});

@connect(
  mapStateToProps,
  mapDispatchToProps()
)
export default class EditorProfile extends React.PureComponent {
  static propTypes = {
    user: PropTypes.object
  };

  static defaultProps = {};

  /**
   *
   */
  componentDidMount() {
    browser.title('Profile');
  }

  /**
   * @returns {*}
   */
  render() {
    const { user } = this.props;
    console.log(user);
    return (
      <Container className="profile gutter-top">
        <Row>
          <Column xl={8} offsetXl={2}>
            <Row>
              <Column xl={6} md={12}>
                <Avatar src={user.avatar} lg />
              </Column>
              <Column xl={6} md={12}>

              </Column>
            </Row>
          </Column>
        </Row>
      </Container>
    );
  }
}
