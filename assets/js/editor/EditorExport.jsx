import React from 'react';
import PropTypes from 'prop-types';
import { connect, constants, strings, mapDispatchToProps } from 'utils';
import { Container, Button } from 'components/bootstrap';
import { Link } from 'components';
import { projectActions, uiActions } from 'actions';

const mapStateToProps = state => ({
  project: state.project
});

@connect(
  mapStateToProps,
  mapDispatchToProps(projectActions, uiActions)
)
export default class EditorExport extends React.PureComponent {
  static propTypes = {
    match:                 PropTypes.object.isRequired,
    project:               PropTypes.object.isRequired,
    uiWorkspace:           PropTypes.func.isRequired,
    projectOpen:           PropTypes.func.isRequired,
    projectDownloadImages: PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   *
   */
  componentDidMount() {
    const { match, project, uiWorkspace, projectOpen } = this.props;

    uiWorkspace('project-export');
    if (!project.id) {
      projectOpen(match.params.id, {
        redirectAfterOpen: false
      });
    }
  }

  /**
   *
   */
  handleDownloadClick = () => {
    const { project, projectDownloadImages } = this.props;

    projectDownloadImages(project.id);
  };

  renderTextarea = () => {
    const { project } = this.props;

    const blocks = Array.from(project.blocks);
    blocks.sort((a, b) => {
      return (a.sortOrder > b.sortOrder) ? 1 : -1;
    });

    let html = '';
    let imageCounter = 1;

    blocks.forEach((block) => {
      switch (block.type) {
        case constants.blockType('text'):
          html = `${html}${block.text}`;
          break;
        case constants.blockType('image'):
          html = `${html}////// Enter Image: ${imageCounter}-${strings.filenameFromUrl(block.media.url)} //////<br />`;
          imageCounter += 1;

          if (block.caption) {
            html = `${html}////// Image Caption: ${block.caption} //////<br />`;
          }
          html = `${html}<br />`;
          break;
        case constants.blockType('video'):
          html = `${html}////// Enter Video URL: ${block.videoUrl} //////<br /><br />`;
          break;
        case constants.blockType('audio'):
          html = `${html}////// Enter Audio URL: ${block.audioUrl} //////<br /><br />`;
          break;
      }
    });

    return (
      <div className="gutter-top">
        <div className="export-export-textarea" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    const { project } = this.props;

    if (!project.id) {
      return null;
    }

    return (
      <Container className="editor-export gutter-top">
        <Link to={`/editor/${project.id}`} theme="success" icon="caret-left" className="margin-right-sm" btn>
          Back to project
        </Link>
        <Button onClick={this.handleDownloadClick} disabled={project.isBusy}>
          Download Images ZIP
        </Button>
        {this.renderTextarea()}
      </Container>
    );
  }
}
