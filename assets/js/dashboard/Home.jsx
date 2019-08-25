import React from 'react';
import PropTypes from 'prop-types';
import { connect, mapDispatchToProps } from 'utils';
import { Button } from 'components';
import { Container } from 'components/bootstrap';
import { uiActions } from 'actions';

const mapStateToProps = state => ({

});

@connect(
  mapStateToProps,
  mapDispatchToProps(uiActions)
)
export default class Home extends React.PureComponent {
  static propTypes = {
    uiWorkspace: PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   *
   */
  componentDidMount() {
    const { uiWorkspace } = this.props;

    uiWorkspace('home');
  }

  /**
   * @returns {*}
   */
  render() {
    return (
      <div className="home-page">
        <div className="home-page-jumbotron">
          <Container className="home-page-cta">
            Crowdfunding tools and services for the DIY creator.
          </Container>
        </div>
        <Container className="home-page-used-by">
          <h4>Used by:</h4>
          <div className="home-page-used-by-images">
            <img src="/images/logo-nadia-labs.png" alt="Nadia Labs" />
            <img src="/images/logo-threadstax.png" alt="Threadstax" />
            <img src="/images/logo-higher-hanger.png" alt="Higher Hanger" />
          </div>
        </Container>
        <div className="home-page-description">
          <Container>
            <h2>Why GoGoKick?</h2>
            <p>
              There are creators who hire agencies and those that do everything themselves.  Here at GoGoKick we
              have all ran our own campaigns and understand the variety of work required to be successful.  Weve
              took everything learned and created tools and crafted services for DIY creators who need a little help.
              Other agencies ask for $10,000+ minimums and want 25%-35% of the raised funds.  Here at GoGoKick the
              tools are FREE and our services are priced equitably for all.
            </p>
          </Container>
        </div>
      </div>
    );
  }
}
