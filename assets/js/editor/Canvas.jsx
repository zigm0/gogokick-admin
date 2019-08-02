import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Droppable } from 'react-beautiful-dnd';
import { connect, mapDispatchToProps } from 'utils';
import { Container, Row, Column } from 'components/bootstrap';
import { CanvasBlock } from 'blocks';
import * as editorActions from 'actions/editorActions';

const mapStateToProps = state => ({
  editor:  state.editor,
  project: state.project
});

@connect(
  mapStateToProps,
  mapDispatchToProps(editorActions)
)
export default class Canvas extends React.PureComponent {
  static propTypes = {
    editor:   PropTypes.object.isRequired,
    project:  PropTypes.object.isRequired,
    dragging: PropTypes.bool
  };

  static defaultProps = {
    dragging: false
  };

  /**
   * @returns {*}
   */
  render() {
    const { editor, project, dragging } = this.props;
    const { canvasBlocks, blockIndex } = editor;

    const bodyClasses = classNames('editor-canvas-body h-100', {
      'editor-canvas-body-dragging': dragging
    });

    return (
      <div className="editor-canvas h-100">
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
                          showAssignment={false}
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
