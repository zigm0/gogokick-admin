import React from 'react';
import PropTypes from 'prop-types';
import { numbers, connect } from 'utils';
import Odometer from 'react-odometerjs';
import { Link, Workspace } from 'components';
import { Container, Row, Column } from 'components/bootstrap';
import { PublicProjectCard } from 'cards';

const mapStateToProps = state => ({
  isAuthenticated: state.user.isAuthenticated
});

@connect(
  mapStateToProps
)
export default class Home extends React.PureComponent {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired
  };

  static defaultProps = {};

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      helped: 620,
      active: 26,
      raised: 1556002
    }
  }

  /**
   *
   */
  componentDidMount() {
    setInterval(() => {
      const { raised } = this.state;
      this.setState({ raised: raised + numbers.random(10, 56) });
    }, 3000);
    setTimeout(() => {
      const { raised } = this.state;
      this.setState({ raised: raised + numbers.random(10, 20) });
    }, 250);

    setInterval(() => {
      const { helped } = this.state;
      this.setState({ helped: helped + numbers.random(1, 2) });
    }, 3500);
    setInterval(() => {
      const { active } = this.state;
      this.setState({ active: active + numbers.random(1, 2) });
    }, 2250);
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
    return (
      <div className="home-page-mission">
        <Container className="home-page-container">
          <h3>Our Mission</h3>
          <p>
            We know the feel of spending countless hours, sleepless nights and caffeine-fueled days pursuing a dream.
            We’ve faced with the daunting task of learning and executing all that goes into successful crowdfunding.
            We started making the tools inside GoGoKick for ourselves and now want to share their benefits to anyone
            else looking to crowdfund a dream.
          </p>
          <p>
            We understand the short timeframe needed to learn things like attracting an audience, crafting a story
            page, filming a video, running ads on the many social platforms, PR outreach and more.  The tools on
            this site were built to help in the following ways:
          </p>
          <ul>
            <li>Design and Create effective campaign Video and Page using current best practices.</li>
            <li>Manage and Organize action items through an interactive checklist.</li>
            <li>Collaborate with team members and bring in hired help to fill in skill gaps.</li>
            <li>Foster community amongst fellow creators and backers.</li>
          </ul>
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
