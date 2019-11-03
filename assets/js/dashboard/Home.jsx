import React from 'react';
import PropTypes from 'prop-types';
import { numbers, connect } from 'utils';
import Odometer from 'react-odometerjs';
import { Link, Workspace } from 'components';
import { Container, Row, Column } from 'components/bootstrap';
import { PublicProjectCard } from 'cards';

const mapStateToProps = state => ({
  mission:         state.content.mission,
  isAuthenticated: state.user.isAuthenticated
});

@connect(
  mapStateToProps
)
export default class Home extends React.PureComponent {
  static propTypes = {
    mission:         PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool.isRequired
  };

  static defaultProps = {};

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      helped: 0,
      active: 0,
      raised: 0
    };
  }

  /**
   *
   */
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        raised: 1556002,
        helped: 620,
        active: 26
      });
    }, 250);
  }

  /**
   * @returns {*}
   */
  renderHero = () => {
    const { isAuthenticated } = this.props;
    const { helped, active, raised } = this.state;

    return (
      <div className="home-page-hero">
        <Container className="home-page-container home-page-hero-top">
          <Row>
            <Column xs={12} md={4} xl={4}>
              <img src="/images/homepage/tools.png" alt="Tools" />
            </Column>
            <Column xs={12} md={8} xl={8}>
              <div className="home-page-hero-cta">
                <h1>Crowd Funding Tools</h1>
                <p>
                  Create and manage your campaign with our easy-to-use tools.  Tools we wished existed when we
                  were building and managing our own campaigns.
                </p>
                <p className="text-center text-xl-right">
                  {isAuthenticated ? (
                    <Link className="btn btn-secondary" to="/editor/new">
                      Start Project
                    </Link>
                  ) : (
                    <Link className="btn btn-secondary" to="/login">
                      Start Project
                    </Link>
                  )}
                </p>
              </div>
            </Column>
          </Row>
        </Container>
        <div className="home-page-hero-footer">
          <Container>
            <Row>
              <Column xs={3} md={4} xl={4}>
                <div>
                  <Odometer value={helped} />
                  <span>Projects Helped</span>
                </div>
              </Column>
              <Column xs={3} md={4} xl={4}>
                <div>
                  <Odometer value={active} />
                  <span>Live Projects</span>
                </div>
              </Column>
              <Column xs={6} md={4} xl={4}>
                <div className="home-page-hero-footer-raised">
                  <Odometer value={raised} />
                  <span>Raised</span>
                </div>
              </Column>
            </Row>
          </Container>
        </div>
      </div>
    );
  };

  /**
   * @returns {*}
   */
  renderMission = () => {
    const { mission } = this.props;

    return (
      <div className="home-page-mission">
        <Container className="home-page-container">
          <h3>{mission.title}</h3>
          <div dangerouslySetInnerHTML={{ __html: mission.html }} />
        </Container>
      </div>
    );
  };

  /**
   * @returns {*}
   */
  renderProjects = () => {
    const { publicProjects } = window.initialState;

    return (
      <div className="home-page-projects">
        <Container className="home-page-container">
          <h3>Projects in the works</h3>
          <Row>
            {publicProjects.map(project => (
              <Column key={project.id} className="d-flex align-items-stretch" xl={4} md={6} sm={12} xs={12}>
                <PublicProjectCard project={project} />
              </Column>
            ))}
          </Row>
          <div className="text-right gutter-top-sm">
            <Link to="/">
              See more projects >>
            </Link>
          </div>
        </Container>
      </div>
    );
  };

  /**
   * @returns {*}
   */
  renderDescription = () => {
    return (
      <div className="home-page-description">
        <Container className="home-page-container">
          <Row>
            <Column xs={12} md={6}>
              <div className="home-page-description-image-box">
                <img src="/images/homepage/page-builder.png" alt="Page builder" />
              </div>
            </Column>
            <Column xs={12} md={6}>
              <div>
                <h4>
                  Creating your story page shouldn&apos;t be hard
                </h4>
                <p>
                  Imagine being able to quickly assemble your crowdfunding page: easily re-arrange Text, Images and
                  Videos with a drag of a mouse. Explore new arrangements fast and simply.
                </p>
              </div>
            </Column>
          </Row>
          <Row>
            <Column xs={12} md={6}>
              <div>
                <h4>
                  Collaborate with your team, wherever you are
                </h4>
                <p>
                  Invite your team into the project or hire us to collaborate write, design or edit your page
                  or videos.
                </p>
              </div>
            </Column>
            <Column xs={12} md={6}>
              <div className="home-page-description-image-box">
                <img src="/images/homepage/teamwork.png" alt="Team work" />
              </div>
            </Column>
          </Row>
          <Row>
            <Column xs={12} md={6}>
              <div className="home-page-description-image-box">
                <img src="/images/homepage/checklist.png" alt="Check list" />
              </div>
            </Column>
            <Column xs={12} md={6}>
              <div>
                <h4>
                  Campaigns are short and there&apos;s a lot to do
                </h4>
                <p>
                  You have less than a few weeks to attract as many backers as possible. Our checklist/reminder
                  system is loaded with best practices.  Add your own to-dos and set reminders so you don’t miss
                  an important action item.
                </p>
              </div>
            </Column>
          </Row>
          <Row>
            <Column xs={12} md={6}>
              <div>
                <h4>
                  One dashboard, many tools
                </h4>
                <p>
                  We have tools for all stages of your campaign. From creating and collaborating the perfect Video
                  and Story Page to managing Ads and Backer engagement and even after the campaign is over with
                  backer management.
                </p>
              </div>
            </Column>
            <Column xs={12} md={6}>
              <div className="home-page-description-image-box">
                <img src="/images/homepage/dashboard.png" alt="Dashboard" />
              </div>
            </Column>
          </Row>
        </Container>
      </div>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    return (
      <Workspace name="home">
        <div className="home-page">
          {this.renderHero()}
          {this.renderMission()}
          {this.renderProjects()}
          {this.renderDescription()}
        </div>
      </Workspace>
    );
  }
}
