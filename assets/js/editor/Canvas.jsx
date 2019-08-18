import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Droppable } from 'react-beautiful-dnd';
import { connect, browser, constants, mapDispatchToProps } from 'utils';
import { Container, Row, Column } from 'components/bootstrap';
import { CanvasBlock } from 'blocks';
import * as editorActions from 'actions/editorActions';

const mapStateToProps = state => ({
  editor:       state.editor,
  campaignType: state.project.campaignType
});

@connect(
  mapStateToProps,
  mapDispatchToProps(editorActions)
)
export default class Canvas extends React.PureComponent {
  static propTypes = {
    editor:              PropTypes.object.isRequired,
    campaignType:        PropTypes.string.isRequired,
    dragging:            PropTypes.bool,
    editorActivateBlock: PropTypes.func.isRequired
  };

  static defaultProps = {
    dragging: false
  };

  /**
   * @param {Event} e
   */
  handleClick = (e) => {
    const { editorActivateBlock} = this.props;

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
      <div
        className={`editor-canvas editor-canvas-campaign-${constants.campaignType(campaignType)} h-100`}
        onClick={this.handleClick}
      >
        <div className={bodyClasses}>
          <Container className="h-100">
            <Row>
              <Column className="editor-canvas-body-col" xl={8} offsetXl={2}>
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
    );
  }
}
