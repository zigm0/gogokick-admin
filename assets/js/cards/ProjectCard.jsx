import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button } from 'components/bootstrap';
import { Icon } from 'components';

export default class ProjectCard extends React.PureComponent {
  static propTypes = {
    project:  PropTypes.object.isRequired,
    selected: PropTypes.bool,
    watching: PropTypes.bool,
    onClick:  PropTypes.func
  };

  static defaultProps = {
    selected: false,
    watching: false,
    onClick:  () => {}
  };

  /**
   * @returns {*}
   */
  render() {
    const { project, selected, watching, onClick } = this.props;

    return (
      <div className={classNames('card-project', { 'card-selected': selected })}>
        {(project.image && project.image.url) ? (
          <img
            src={project.image.url}
            className="card-project-thumb"
            alt="Thumbnail"
            onClick={e => onClick(e, project)}
          />
        ) : (
          <img
            src="/images/image-placeholder.png"
            className="card-project-thumb"
            alt="Thumbnail"
            onClick={e => onClick(e, project)}
          />
        )}
        <div className="card-project-details">
          <h4 className="card-project-name">
            {project.name}
          </h4>
          <div className="card-project-subtitle">
            {project.subtitle}
          </div>
          <div className="card-project-footer">
            {!watching && (
              <Button theme="success" onClick={e => onClick(e, project)} sm>
                Edit
              </Button>
            )}
            <div className="card-project-social-icons">
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
            </div>
          </div>
        </div>
      </div>
    );
  }
}
