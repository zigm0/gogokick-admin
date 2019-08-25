import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'utils';
import { Link } from 'components';
import { Container } from 'components/bootstrap';

const mapStateToProps = state => ({
  isAuthenticated: state.user.isAuthenticated
});

@connect(
  mapStateToProps
)
export default class HomeHeader extends React.PureComponent {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired
  };

  static defaultProps = {};

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.header = React.createRef();
  }


  /**
   *
   */
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll, false);
  }

  /**
   *
   */
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll, false);
  }

  /**
   *
   */
  handleScroll = () => {
    const top = document.body.scrollTop || document.documentElement.scrollTop;

    if (top > 100 && !this.header.current.classList.contains('home-page-header-opaque')) {
      this.header.current.classList.add('home-page-header-opaque');
    } else if (top < 100 && this.header.current.classList.contains('home-page-header-opaque')) {
      this.header.current.classList.remove('home-page-header-opaque');
    }
  };

  /**
   * @returns {*}
   */
  render() {
    const { isAuthenticated } = this.props;

    return (
      <header ref={this.header} className="home-page-header">
        <Container className="d-flex align-items-center">
          <div className="home-page-header-brand">
            <Link to="/">
              <img src="/images/logo-2.png" alt="Logo" />
            </Link>
          </div>
          <div className="home-page-header-links">
            <Link to="/">
              Start a project
            </Link>
            {isAuthenticated ? (
              <Link to="/dashboard">
                Dashboard
              </Link>
            ) : (
              <Link to="/">
                Login
              </Link>
            )}
            <Link to="/about">
              About
            </Link>
          </div>
        </Container>
      </header>
    );
  }
}
