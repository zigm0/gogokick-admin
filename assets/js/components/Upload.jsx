import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import classNames from 'classnames';
import { connect, mapDispatchToProps } from 'utils';
import { Icon, Loading } from 'components';
import { mediaActions } from 'actions';

const mapStateToProps = state => ({
  isUploading: state.media.isUploading
});

@connect(
  mapStateToProps,
  mapDispatchToProps(mediaActions)
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
   */
  handleDrop = (files) => {
    const { system, cropping, cropOptions, mediaUpload, mediaCrop, onDrop, onUploaded } = this.props;

    const e = new CustomEvent('upload');
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
        onDrop={files => this.handleDrop(files)}
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
