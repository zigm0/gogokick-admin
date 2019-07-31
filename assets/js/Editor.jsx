import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { DragDropContext } from 'react-beautiful-dnd';
import { connect, mapDispatchToProps } from 'utils';
import { Row, Column } from 'components/bootstrap';
import { Loading } from 'components';
import * as editorActions from 'actions/editorActions';
import Sidebar from 'editor/Sidebar';
import Canvas from 'editor/Canvas';

const mapStateToProps = state => ({
  editor: state.editor
});

@connect(
  mapStateToProps,
  mapDispatchToProps(editorActions)
)
export default class Editor extends React.PureComponent {
  static propTypes = {
    editor:            PropTypes.object.isRequired,
    editorInit:        PropTypes.func.isRequired,
    editorDrop:        PropTypes.func.isRequired,
    editorOpenProject: PropTypes.func.isRequired
  };

  /**
   *
   */
  componentDidMount() {
    const { editorInit, editorOpenProject } = this.props;

    editorInit({});
    editorOpenProject(1);
  }

  /**
   * @param {Event} e
   */
  handleDragEnd = (e) => {
    const { editorDrop } = this.props;

    editorDrop(e);
  };

  /**
   * @returns {*}
   */
  render() {
    const { editor } = this.props;

    const classes = classNames('editor h-100', `editor-mode-${editor.mode}`);

    return (
      <div className={classes}>
        <DragDropContext onDragEnd={this.handleDragEnd}>
          <Row className="h-100">
            <Column className="editor-sidebar-col" xl={2} md={12}>
              <Sidebar />
            </Column>
            <Column className="editor-canvas-col" xl={10} md={12}>
              <Canvas />
            </Column>
          </Row>
        </DragDropContext>
        {editor.isBusy && (
          <Loading middle />
        )}
      </div>
    );
  }
}
