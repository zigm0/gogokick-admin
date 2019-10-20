import React from 'react';
import PropTypes from 'prop-types';
import { connect, mapDispatchToProps } from 'utils';
import { Container, Row, Column } from 'components/bootstrap';
import { Link } from 'components';

const mapStateToProps = state => ({

});

@connect(
  mapStateToProps,
  mapDispatchToProps()
)
export default class Footer extends React.PureComponent {
  static propTypes = {};

  static defaultProps = {};

  /**
   * @returns {*}
   */
  render() {
    return (
      <footer className="footer">
        <Container>
          <Row>
            <Column xl={3} sm={3} xs={6}>
              <h6>Resources</h6>
              <ul>
                <li>
                  <Link to="/">Story Builder</Link>
                </li>
                <li>
                  <Link to="/">Campaign Checklist</Link>
                </li>
                <li>
                  <Link to="/">Video Storyboard</Link>
                </li>
                <li>
                  <Link to="/">Press Release Manager</Link>
                </li>
              </ul>
            </Column>
            <Column xl={3} sm={3} xs={6}>
              <h6>Services</h6>
              <ul>
                <li>
                  <Link to="/">Campaign Writing</Link>
                </li>
                <li>
                  <Link to="/">Video Production</Link>
                </li>
                <li>
                  <Link to="/">Campaign Management</Link>
                </li>
                <li>
                  <Link to="/">Ad Management</Link>
                </li>
              </ul>
            </Column>
            <Column xl={3} sm={3} xs={6}>
              <h6>Social</h6>
              <ul>
                <li>
                  <Link to="/">YouTube</Link>
                </li>
                <li>
                  <Link to="/">Twitter</Link>
                </li>
                <li>
                  <Link to="/">Facebook</Link>
                </li>
                <li>
                  <Link to="/">Pinterest</Link>
                </li>
              </ul>
            </Column>
            <Column xl={3} sm={3} xs={6}>
              <h6>Legal</h6>
              <ul>
                <li>
                  <Link to="/">Privacy</Link>
                </li>
                <li>
                  <Link to="/">Terms of Use</Link>
                </li>
                <li>
                  <Link to="/">Security</Link>
                </li>
                <li>
                  <Link to="/">Contact Us</Link>
                </li>
              </ul>
            </Column>
          </Row>
        </Container>
      </footer>
    );
  }
}
