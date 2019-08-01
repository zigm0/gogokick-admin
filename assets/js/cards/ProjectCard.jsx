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
          {project.screenshot && (
            <img src={project.screenshot} className="card-project-thumb" alt="Screenshot" />
          )}
        </CardBody>
        <CardFooter title={project.name}>
          {strings.truncate(project.name, 18)}
        </CardFooter>
      </Card>
    );
  }
}
