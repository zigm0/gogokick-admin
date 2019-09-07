import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button } from 'components/bootstrap';
import { Icon } from 'components';

export default class ProjectCard extends React.PureComponent {
  static propTypes = {
    project:  PropTypes.object.isRequired,
    selected: PropTypes.bool,
    onClick:  PropTypes.func
  };

  static defaultProps = {
    selected: false,
    onClick:  () => {}
  };

  /**
   * @returns {*}
   */
  render() {
    const { project, selected, onClick } = this.props;

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
            <Button theme="success" onClick={e => onClick(e, project)} sm>
              Edit
            </Button>
            <div className="card-project-social-icons">
              <Icon
                name="twitter-square"
                className="social-icon social-icon-twitter margin-right-sm"
                fixed={false}
                fab
              />
              <Icon
                name="youtube-square"
                className="social-icon social-icon-youtube margin-right-sm"
                fixed={false}
                fab
              />
              <Icon
                name="facebook-square"
                className="social-icon social-icon-facebook margin-right-sm"
                fixed={false}
                fab
              />
              <Icon
                name="instagram"
                className="social-icon social-icon-instagram"
                fixed={false}
                fab
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
