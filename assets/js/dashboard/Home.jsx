import React from 'react';
import { Workspace } from 'components';
import { Container, Row, Column } from 'components/bootstrap';
import { PublicProjectCard } from 'cards';

export default class Home extends React.PureComponent {
  static propTypes = {};

  static defaultProps = {};

  /**
   * @returns {*}
   */
  renderProjects = () => {
    const { publicProjects } = window.initialState;

    return (
      <Container>
        <Row className="home-page-public-projects">
          {publicProjects.map(project => (
            <Column key={project.id} className="d-flex align-items-stretch" xl={4} md={6} sm={12} xs={12}>
              <PublicProjectCard project={project} />
            </Column>
          ))}
        </Row>
      </Container>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    return (
      <Workspace name="home">
        <div className="home-page">
          <div className="home-page-jumbotron">
            <div className="home-page-cta">
              Crowdfunding tools and services for the DIY creator.
            </div>
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
          {this.renderProjects()}
        </div>
      </Workspace>
    );
  }
}
