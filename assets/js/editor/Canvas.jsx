import React from 'react';
import PropTypes from 'prop-types';
import { Droppable } from 'react-beautiful-dnd';
import { connect, mapDispatchToProps } from 'utils';
import { Container, Row, Column, Button } from 'components/bootstrap';
import { Avatar, Icon } from 'components';
import { CanvasBlock } from 'blocks';

const mapStateToProps = state => ({
  editor: state.editor
});

@connect(
  mapStateToProps,
  mapDispatchToProps()
)
export default class Canvas extends React.PureComponent {
  static propTypes = {
    editor: PropTypes.object.isRequired
  };

  static defaultProps = {};

  /**
   * @returns {*}
   */
  renderUserMenu = () => {
    return (
      <div className="editor-header-user-menu">
        <div className="avatar-menu">
          <Icon name="angle-down" />
          <Avatar src="https://app.blocksedit.com/avatars/default-avatar-240x240.png" sm />
        </div>
        <div>Scott K.</div>
      </div>
    );
  };

  /**
   * @returns {*}
   */
  renderHeader = () => {
    return (
      <div className="editor-header editor-header-canvas">
        <div className="editor-header editor-header-canvas-buttons">
          <Button icon="file" sm>
            Save
          </Button>
          <Button icon="eye" sm>
            Preview
          </Button>
          <Button icon="cog" sm>
            Settings
          </Button>
          <Button icon="undo" sm>
            Undo
          </Button>
          <Button icon="redo" sm>
            Redo
          </Button>
          <Button icon="question-circle" sm>
            Help
          </Button>
        </div>
        <div className="editor-header-project-name">
          The Flappy Project
        </div>
        {this.renderUserMenu()}
      </div>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    const { editor } = this.props;

    return (
      <div className="editor-canvas h-100">
        {this.renderHeader()}
        <div className="editor-canvas-body h-100">
          <Container className="h-100">
            <Row>
              <Column xl={8} offsetXl={2}>
                <Droppable droppableId="canvasBlocks">
                  {(provided) => (
                    <ul className="editor-canvas-blocks" ref={provided.innerRef}>
                      {editor.canvasBlocks.map((block, index) => (
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
