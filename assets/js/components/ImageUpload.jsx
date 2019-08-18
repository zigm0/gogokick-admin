import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone';
import classNames from 'classnames';
import { Icon } from 'components';

const maxSizeMB = 20;

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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: maxSizeMB * 1024 * 1024,
    accept:  'image/*'
  });

  const classes = classNames('upload-container', {
    'hover': isDragActive
  });

  return (
    <div className={classes} {...getRootProps()}>
      <input {...getInputProps()} />
      {(media && media.url) && (
        <figure>
          <img src={media.url} alt="" />
        </figure>
      )}

      <div className="upload-container-circle-container">
        <div className="upload-container-circle upload-container-circle-image">
          <Icon name="image" size={2} far />
        </div>
        {(!media || !media.url) && (
          <>
            <div className="upload-container-top">
              Drop an image here, or click to select a file.
            </div>
            <div className="upload-container-bottom">
              It must be a JPG, PNG, GIF, TIFF or BMP. No larger than {maxSizeMB}MB.
            </div>
          </>
        )}
      </div>
    </div>
  )
};

export default ImageUpload;
