import React from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import classNames from 'classnames';
import { connect, mapDispatchToProps } from 'utils';
import { Icon, Loading } from 'components';
import { mediaActions, uiActions } from 'actions';

const mapStateToProps = state => ({
  isUploading: state.media.isUploading
});

@connect(
  mapStateToProps,
  mapDispatchToProps(mediaActions, uiActions)
)
export default class Upload extends React.PureComponent {
  static propTypes = {
    system:      PropTypes.string,
    maxSizeMB:   PropTypes.number.isRequired,
    accept:      PropTypes.string.isRequired,
    cropping:    PropTypes.bool,
    cropOptions: PropTypes.object,
    className:   PropTypes.string,
    children:    PropTypes.node,
    isUploading: PropTypes.bool.isRequired,
    uiToast:     PropTypes.func.isRequired,
    onDrop:      PropTypes.func,
    onUploaded:  PropTypes.func,
    mediaCrop:   PropTypes.func.isRequired,
    mediaUpload: PropTypes.func.isRequired
  };

  static defaultProps = {
    cropping:    false,
    system:      '',
    cropOptions: {},
    onDrop:      () => {},
    onUploaded:  () => {},
    className:   '',
    children:    ''
  };

  /**
   * @param {File[]} files
   * @param {File[]} rejected
   */
  handleDrop = (files, rejected) => {
    const {
      system,
      maxSizeMB,
      cropping,
      cropOptions,
      mediaUpload,
      mediaCrop,
      onDrop,
      onUploaded,
      uiToast
    } = this.props;

    if (rejected.length > 0) {
      uiToast(`File must be ${maxSizeMB}MB or less.`, { type: 'error' });
      return;
    }

    if (files.length === 0) {
      return;
    }

    const e = new CustomEvent('upload', { cancelable: true });
    onDrop(e, files[0]);

    if (!e.defaultPrevented) {
      mediaUpload({
        system,
        file:       files[0],
        onComplete: (media) => {
          if (cropping) {
            mediaCrop({
              ...cropOptions,
              media,
              onComplete: (image) => {
                onUploaded(image);
              }
            })
          } else {
            onUploaded(media);
          }
        }
      });
    }
  };

  /**
   * @returns {*}
   */
  render() {
    const { accept, maxSizeMB, className, isUploading, children } = this.props;

    return (
      <Dropzone
        accept={accept}
        maxSize={maxSizeMB * 1024 * 1024}
        onDrop={(acceptedFiles, rejectedFiles) => this.handleDrop(acceptedFiles, rejectedFiles)}
        multiple={false}
      >
        {({ getRootProps, getInputProps, isDragActive }) => {
          const classes = classNames('upload-container', className, {
            'hover': isDragActive
          });

          return (
            <div className={classes} {...getRootProps()}>
              <input {...getInputProps()} />
              <div className="upload-container-circle upload-container-circle-image">
                <Icon name="image" size={2} far/>
                {isUploading && (
                  <Loading white />
                )}
              </div>
              {children}
            </div>
          );
        }}
      </Dropzone>
    );
  }
}
