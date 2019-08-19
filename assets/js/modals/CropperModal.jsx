import React from 'react';
import PropTypes from 'prop-types';
import Cropper from 'react-cropper';
import { connect, system, mapDispatchToProps } from 'utils';
import { Button } from 'components/bootstrap';
import { Modal } from 'components';
import * as editorActions from 'actions/editorActions';
import * as mediaActions from 'actions/mediaActions';
import * as projectActions from 'actions/projectActions';

const mapStateToProps = state => ({
  media: state.editor.modalMeta
});

@connect(
  mapStateToProps,
  mapDispatchToProps(editorActions, mediaActions, projectActions)
)
export default class CropperModal extends React.PureComponent {
  static propTypes = {
    media:           PropTypes.object,
    mediaReplace:    PropTypes.func.isRequired,
    editorModal:     PropTypes.func.isRequired,
    projectSettings: PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);

    this.cropper = React.createRef();
  }

  /**
   *
   */
  handleCropClick = () => {
    const { media, mediaReplace, editorModal, projectSettings } = this.props;

    const dataUrl = this.cropper.current.getCroppedCanvas().toDataURL();
    mediaReplace({
      media,
      dataUrl,
      onComplete: (image) => {
        projectSettings({
          image
        });
        editorModal({
          modal: 'cropper',
          open:  false
        });
      }
    });
  };

  /**
   * @returns {*}
   */
  render() {
    const { media } = this.props;

    if (!media) {
      return null;
    }

    const buttons = (
      <Button theme="success" onClick={this.handleCropClick} sm>
        Crop
      </Button>
    );

    return (
      <Modal
        name="cropper"
        title="Crop Image"
        icon="crop"
        buttons={buttons}
        lg
      >
        <Cropper
          src={media.url}
          ref={this.cropper}
          style={{ height: 500, width: '100%' }}
          aspectRatio={1024 / 576}
          guides={false}
          viewMode={1}
          minContainerWidth={765}
          minContainerHeight={500}
        />
      </Modal>
    );
  }
}
