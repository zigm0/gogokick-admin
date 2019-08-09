import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { DragDropContext } from 'react-beautiful-dnd';
import { Route, Router, Switch } from 'react-router-dom';
import { connect, history, mapDispatchToProps } from 'utils';
import { Row, Column } from 'components/bootstrap';
import * as editorActions from 'actions/editorActions';
import * as userActions from 'actions/userActions';
import * as projectActions from 'actions/projectActions';
import Sidebar from 'editor/Sidebar';
import Canvas from 'editor/Canvas';

const mapStateToProps = state => ({
  project: state.project,
  editor:  state.editor,
  user:    state.user
});

@connect(
  mapStateToProps,
  mapDispatchToProps(editorActions, userActions, projectActions)
)
export default class EditorBody extends React.PureComponent {
  static propTypes = {};

  static defaultProps = {};

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);

    this.state = {
      dragging: false
    };
  }

  /**
   * @returns {*}
   */
  render() {
    const { dragging } = this.state;

    return (
      <Row className="editor-body">
        <Column className="editor-sidebar-col d-none d-lg-block d-xl-block" xl={2} lg={3} md={12}>
          <Sidebar />
        </Column>
        <Column className="editor-canvas-col" xl={10} lg={9} md={12}>
          <Canvas dragging={dragging} />
        </Column>
      </Row>
    );
  }
}
