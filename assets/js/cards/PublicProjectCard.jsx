import React from 'react';
import PropTypes from 'prop-types';
import { connect, strings, arrays, mapDispatchToProps } from 'utils';
import { Card, CardBody, CardFooter, CardImage, Button } from 'components/bootstrap';
import { Icon, Link } from 'components';
import { projectActions } from 'actions';

const mapStateToProps = state => ({
  user:     state.user,
  watching: state.project.watching
});

@connect(
  mapStateToProps,
  mapDispatchToProps(projectActions)
)
export default class PublicProjectCard extends React.PureComponent {
  static propTypes = {
    user:         PropTypes.object.isRequired,
    watching:     PropTypes.array.isRequired,
    project:      PropTypes.object.isRequired,
    projectWatch: PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   *
   */
  handleWatchlistClick = () => {
    const { project, projectWatch } = this.props;

    projectWatch(project.id);
  };

  /**
   * @returns {*}
   */
  render() {
    const { user, project, watching } = this.props;

    const index     = arrays.findIndexByID(watching, project.id);
    const isOwner   = (user && project.user.id === user.id);
    const hasFollow = !isOwner && (
      project.social.twitter || project.social.youtube || project.social.facebook || project.social.instagram
    );

    return (
      <Card className="card-public-project">
        <Link to={`/p/${project.id}/${project.slug}`}>
          <CardImage src={project.image.url} />
        </Link>
        <CardBody className="card-public-project-body">
          <div className="card-public-project-title">
            {strings.truncate(project.name, 25)}
          </div>
          <div className="card-public-project-subtitle">
            {strings.truncate(project.subtitle, 60)}
          </div>
        </CardBody>
        {hasFollow && (
          <small>Follow</small>
        )}
        <CardFooter className="card-public-project-footer">
          {project.social.twitter && (
            <a href={project.social.twitter} rel="noopener noreferrer" target="_blank">
              <Icon
                name="twitter-square"
                className="social-icon social-icon-twitter margin-right-sm"
                fixed={false}
                fab
              />
            </a>
          )}
          {project.social.youtube && (
            <a href={project.social.youtube} rel="noopener noreferrer" target="_blank">
              <Icon
                name="youtube-square"
                className="social-icon social-icon-youtube margin-right-sm"
                fixed={false}
                fab
              />
            </a>
          )}
          {project.social.facebook && (
            <a href={project.social.facebook} rel="noopener noreferrer" target="_blank">
              <Icon
                name="facebook-square"
                className="social-icon social-icon-facebook margin-right-sm"
                fixed={false}
                fab
              />
            </a>
          )}
          {project.social.instagram && (
            <a href={project.social.instagram} rel="noopener noreferrer" target="_blank">
              <Icon
                name="instagram"
                className="social-icon social-icon-instagram"
                fixed={false}
                fab
              />
            </a>
          )}
          {!isOwner && (
            <Button onClick={this.handleWatchlistClick} sm>
              {index === -1 ? 'Add to Watchlist' : 'Remove' }
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }
}
