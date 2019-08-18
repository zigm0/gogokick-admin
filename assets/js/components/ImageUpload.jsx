import React, {useCallback} from 'react'
import { useDropzone } from 'react-dropzone';
import classNames from 'classnames';
import { Icon } from 'components';

/**
 *
 * @param {*} project
 * @param {Function} handleDrop
 * @returns {*}
 */
const ImageUpload = ({ media, onDrop: handleDrop }) => {
  const onDrop = useCallback(acceptedFiles => {
    handleDrop(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const classes = classNames('upload-container', {
    'hover': isDragActive
  });

  return (
    <div
      className={classes}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {(media && media.url) && (
        <img src={media.url} alt="" />
      )}
      {(!media || !media.url) && (
        <div className="d-flex flex-column justify-content-center text-center">
          <div className="upload-container-circle">
            <Icon name="image" size={2} far />
          </div>
          <div className="upload-container-top">
            Drop an image here, or click to select a file.
          </div>
          <div className="upload-container-bottom">
            It must be a JPG, PNG, GIF, TIFF or BMP. No larger than 2MB.
          </div>
        </div>
      )}
    </div>
  )
};

export default ImageUpload;
