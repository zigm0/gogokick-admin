import React from 'react';
import PropTypes from 'prop-types';
import { connect, mapDispatchToProps } from 'utils';
import { Container } from 'components/bootstrap';
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
        <Container className="text-center">
          <div>
            &copy; 2019 GoGoKick
          </div>
          <div>
            <Link to="/about">About</Link>
            &nbsp;&middot;&nbsp;
            <Link to="/terms">Terms of Use</Link>
            &nbsp;&middot;&nbsp;
            <Link to="/privacy">Privacy</Link>
          </div>
        </Container>
      </footer>
    );
  }
}
