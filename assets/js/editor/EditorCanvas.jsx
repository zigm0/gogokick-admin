import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Droppable } from 'react-beautiful-dnd';
import { connect, browser, mapDispatchToProps, constants } from 'utils';
import { Container, Row, Column } from 'components/bootstrap';
import { Workspace } from 'components';
import { CanvasBlock } from './blocks';
import { editorActions, projectActions, userActions, uiActions, notesActions } from 'actions';

const mapStateToProps = state => ({
  project:      state.project,
  editor:       state.editor,
  campaignType: state.project.campaignType
});

@connect(
  mapStateToProps,
  mapDispatchToProps(projectActions, userActions, uiActions, notesActions, editorActions)
)
export default class EditorCanvas extends React.PureComponent {
  static propTypes = {
    editor:              PropTypes.object.isRequired,
    campaignType:        PropTypes.number.isRequired,
    dragging:            PropTypes.bool,
    match:               PropTypes.object.isRequired,
    project:             PropTypes.object.isRequired,
    projectOpen:         PropTypes.func.isRequired,
    uiSidebarMenuOpen:   PropTypes.func.isRequired,
    notesOpen:           PropTypes.func.isRequired,
    notesClose:          PropTypes.func.isRequired,
    editorActivateBlock: PropTypes.func.isRequired
  };

  static defaultProps = {
    dragging: false
  };

  /**
   *
   */
  componentDidMount() {
    const { match, project, projectOpen, uiSidebarMenuOpen } = this.props;

    uiSidebarMenuOpen(false);
    const matchId = parseInt(match.params.id, 10);
    if (!isNaN(matchId) && project.id !== matchId) {
      projectOpen(matchId);
    } else {
      this.handleUpdate();
    }
  }

  /**
   * @param {*} prevProps
   */
  componentDidUpdate(prevProps) {
    const { project } = this.props;
    const { project: prevProject } = prevProps;

    browser.title(project.name);
    if (project.id !== prevProject.id) {
      this.handleUpdate();
    }
  }

  /**
   *
   */
  componentWillUnmount() {
    const { notesClose } = this.props;

    notesClose();
  }

  /**
   *
   */
  handleUpdate = () => {
    const { notesOpen } = this.props;

    if (document.location.hash.indexOf('#block-') === 0) {
      const parts = document.location.hash.split('-');
      if (parts.length === 2) {
        const block = document.querySelector(document.location.hash);
        setTimeout(() => {
          const blockID = parseInt(parts[1], 10);
          notesOpen(blockID);
          block.scrollIntoView({
            behavior: 'smooth'
          });
        }, 250);
      }
    }
  };

  /**
   * @param {Event} e
   */
  handleMouseDown = (e) => {
    const { editorActivateBlock } = this.props;

    if (!browser.hasParentClass(e.target, 'block-container')) {
      editorActivateBlock(0);
    }
  };

  /**
   * @returns {*}
   */
  render() {
    const { editor, dragging, campaignType } = this.props;
    const { canvasBlocks, blockIndex } = editor;

    const bodyClasses = classNames('editor-canvas-body h-100', {
      'editor-canvas-body-dragging': dragging
    });

    return (
      <Workspace name="editor">
        <div
          onMouseDown={this.handleMouseDown}
          className={`editor-canvas editor-canvas-campaign-${constants.campaignType(campaignType)} h-100`}
        >
          <div className={bodyClasses}>
            <Container className="h-100">
              <Row className="justify-content-center">
                <Column className="editor-canvas-body-col" xl={8}>
                  <div className="block-text">
                    <h3 className="block-text-headline-about">
                      {campaignType === constants.campaignType('kickstarter') ? 'About' : 'Overview'}
                    </h3>
                  </div>
                  <Droppable droppableId="canvasBlocks">
                    {(provided) => (
                      <ul className="editor-canvas-blocks" ref={provided.innerRef}>
                        {canvasBlocks[blockIndex].map((block, index) => (
                          <CanvasBlock
                            key={block.id}
                            block={block}
                            index={index}
                          />
                        ))}
                      </ul>
                    )}
                  </Droppable>
                </Column>
              </Row>
            </Container>
          </div>
        </div>
      </Workspace>
    );
  }
}
