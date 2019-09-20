import React from 'react';
import PropTypes from 'prop-types';
import Clipboard from 'clipboard';
import YouTube from 'react-youtube';
import { connect, constants, strings, acl, history, mapDispatchToProps } from 'utils';
import { Row, Column, Button } from 'components/bootstrap';
import { Link, Workspace } from 'components';
import { projectActions } from 'actions';

const mapStateToProps = state => ({
  project:      state.project,
  meTeamMember: state.editor.meTeamMember
});

@connect(
  mapStateToProps,
  mapDispatchToProps(projectActions)
)
export default class EditorExport extends React.PureComponent {
  static propTypes = {
    match:                 PropTypes.object.isRequired,
    project:               PropTypes.object.isRequired,
    meTeamMember:          PropTypes.object.isRequired,
    projectOpen:           PropTypes.func.isRequired,
    projectDownloadImages: PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);

    this.btnCopy = React.createRef();
    this.clipboard = null;
  }

  /**
   *
   */
  componentDidMount() {
    const { match, project, projectOpen, meTeamMember } = this.props;
    const { user, roles } = meTeamMember;

    if (user && !acl(roles, 'export', 'project')) {
      history.push('/');
    }

    if (!project.id) {
      projectOpen(match.params.id, {
        redirectAfterOpen: false
      });
    }
  }

  /**
   * @param {*} prevProps
   */
  componentDidUpdate(prevProps) {
    const { project, meTeamMember } = this.props;
    const { project: prevProject } = prevProps;
    const { user, roles } = meTeamMember;

    if (user && !acl(roles, 'export', 'project')) {
      history.push('/');
    }

    if (project.id !== prevProject.id && this.clipboard === null) {
      this.clipboard = new Clipboard(this.btnCopy.current);
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
        <div
          id="project-export-textarea"
          className="export-export-textarea"
          dangerouslySetInnerHTML={{ __html: html }}
        />
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
        <Row className="editor-export gutter-top">
          <Column xl={6} offsetXl={3}>
            <Link to={`/editor/${project.id}`} icon="caret-left" className="margin-right-sm" btn>
              Back to project
            </Link>
            <ul className="project-export-list">
              <li>
                <h3>Step 1</h3>
                <p>
                  Click Download below and save the Zip file in a convenient area on your computer.
                </p>
                <Button
                  className="project-export-btn"
                  theme="success"
                  onClick={this.handleDownloadClick}
                  disabled={project.isBusy}
                >
                  Download
                </Button>
              </li>
              <li>
                <h3>Step 2</h3>
                <p>
                  Click the Copy button to copy your page to your clipboard.
                </p>
                <button
                  ref={this.btnCopy}
                  className="btn btn-success project-export-btn"
                  data-clipboard-target="#project-export-textarea"
                >
                  Copy
                </button>
                {this.renderTextarea()}
              </li>
              <li>
                <h3>Step 3</h3>
                <p>
                  You now have everything you need to move your page
                  to {strings.ucWords(constants.campaignType(project.campaignType))}. Follow along with this short video
                  to get everything in place.
                </p>
                <iframe
                  src="https://player.vimeo.com/video/360025029"
                  width="100%"
                  height="460"
                  frameBorder="0"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                />
              </li>
            </ul>
          </Column>
        </Row>
      </Workspace>
    );
  }
}
