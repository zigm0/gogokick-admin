import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { strings } from 'utils';
import { Card, CardBody, CardFooter } from 'components/bootstrap';

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
      <Card
        key={project.dateUpdated}
        className={classNames('card-project', { 'card-selected': selected })}
        onClick={e => onClick(e, project)}
      >
        <CardBody>
          {(project.image && project.image.url) ? (
            <img src={project.image.url} className="card-project-thumb" alt="Thumbnail" />
          ) : (
            <img src="/images/block-placeholder-image.png" className="card-project-thumb" alt="Thumbnail" />
          )}
        </CardBody>
        <CardFooter title={project.name}>
          {strings.truncate(project.name || '', 18)}
        </CardFooter>
      </Card>
    );
  }
}
