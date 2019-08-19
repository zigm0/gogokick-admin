import React, {useCallback} from 'react'
import { useDropzone } from 'react-dropzone';
import classNames from 'classnames';
import { Icon, Loading } from 'components';

/**
 *
 * @param {*} project
 * @param {boolean} isUploading
 * @param {Function} mediaUpload
 * @returns {*}
 */
const ProjectImage = ({ media, isUploading, mediaUpload }) => {
  const styles = {};
  if (media && media.url) {
    styles.backgroundImage = `url(${media.url})`;
  }

  const onDrop = useCallback(acceptedFiles => {
    mediaUpload(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*'
  });

  const classes = classNames('upload-container project-settings-banner', {
    'hover': isDragActive
  });

  return (
    <div
      className={classes}
      style={styles}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {(!media || !media.url) && (
        <div className="upload-container-circle-container">
          <div className="upload-container-circle">
            <Icon name="image" size={2} far />
            {isUploading && (
              <Loading />
            )}
          </div>
          <div className="project-settings-banner-top">
            Drop an image here, or click to select a file.
          </div>
          <div className="project-settings-banner-bottom">
            It must be a JPG, PNG, GIF, TIFF or BMP. No larger than 2MB.
          </div>
        </div>
      )}
    </div>
  )
};

export default ProjectImage;
