import React from 'react';
import PropTypes from 'prop-types';
import { connect, constants, mapDispatchToProps } from 'utils';
import { Workspace } from 'components';
import { Container, Row, Column } from 'components/bootstrap';
import CanvasBlockBody from '../editor/blocks/CanvasBlockBody';
import { projectActions } from 'actions';

const mapStateToProps = state => ({
  project: state.project,
  editor:  state.editor,
});

@connect(
  mapStateToProps,
  mapDispatchToProps(projectActions)
)
export default class ProjectPreview extends React.PureComponent {
  static propTypes = {
    project:        PropTypes.object.isRequired,
    editor:         PropTypes.object.isRequired,
    match:          PropTypes.object.isRequired,
    projectPreview: PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   *
   */
  componentDidMount() {
    const { match, projectPreview } = this.props;
    const { id, hash } = match.params;

    projectPreview(id, hash);
  }

  /**
   * @returns {*}
   */
  render() {
    const { project, editor } = this.props;
    const { campaignType } = project;
    const { canvasBlocks, blockIndex } = editor;

    if (project.id === 0) {
      return null;
    }

    return (
      <Workspace name="editor">
        <div
          className={`editor-canvas editor-canvas-campaign-${constants.campaignType(campaignType)} h-100`}
        >
          <div className="editor-canvas-body h-100">
            <Container className="h-100">
              <Row className="justify-content-center">
                <Column className="editor-canvas-body-col" xl={8}>
                  <div className="block-text">
                    <h3 className="block-text-headline-about">
                      {campaignType === constants.campaignType('kickstarter') ? 'About' : 'Overview'}
                    </h3>
                  </div>
                  <ul className="editor-canvas-blocks">
                    {canvasBlocks[blockIndex].map((block, index) => (
                      <CanvasBlockBody
                        key={block.id}
                        block={block}
                        index={index}
                        isActive={false}
                        isHover={false}
                        isDragging={false}
                        onChange={() => {}}
                      />
                    ))}
                  </ul>
                </Column>
              </Row>
            </Container>
          </div>
        </div>
      </Workspace>
    );
  }
}
