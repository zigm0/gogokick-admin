import React from 'react';
import PropTypes from 'prop-types';
import { connect, constants, strings, mapDispatchToProps } from 'utils';
import { Container, Button } from 'components/bootstrap';
import { Link, Workspace } from 'components';
import { projectActions } from 'actions';

const mapStateToProps = state => ({
  project: state.project
});

@connect(
  mapStateToProps,
  mapDispatchToProps(projectActions)
)
export default class EditorExport extends React.PureComponent {
  static propTypes = {
    match:                 PropTypes.object.isRequired,
    project:               PropTypes.object.isRequired,
    projectOpen:           PropTypes.func.isRequired,
    projectDownloadImages: PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   *
   */
  componentDidMount() {
    const { match, project, projectOpen } = this.props;

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

  /**
   * @returns {*}
   */
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
          if (block.text) {
            html = `${html}${block.text}<br /><br />`;
          }
          break;
        case constants.blockType('image'):
          if (block.media) {
            html = `${html}## Enter Image: ${imageCounter}-${strings.filenameFromUrl(block.media.url)}<br />`;
            imageCounter += 1;

            if (block.caption) {
              html = `${html}## Image Caption: ${block.caption}<br />`;
            }
            if (block.link) {
              html = `${html}## Image Link: ${block.link}<br />`;
            }
            html = `${html}<br />`;
          }
          break;
        case constants.blockType('video'):
          if (block.videoUrl) {
            html = `${html}## Enter Video URL: ${block.videoUrl}<br /><br />`;
          }
          break;
        case constants.blockType('audio'):
          if (block.audioUrl) {
            html = `${html}## Enter Audio URL: ${block.audioUrl}<br /><br />`;
          }
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
      <Workspace name="project-export">
        <Container className="editor-export gutter-top">
          <Link to={`/editor/${project.id}`} theme="success" icon="caret-left" className="margin-right-sm" btn>
            Back to project
          </Link>
          <Button onClick={this.handleDownloadClick} disabled={project.isBusy}>
            Download Images ZIP
          </Button>
          {this.renderTextarea()}
        </Container>
      </Workspace>
    );
  }
}
