import React, {useCallback} from 'react'
import { useDropzone } from 'react-dropzone';
import classNames from 'classnames';
import { Icon } from 'components';

/**
 *
 * @param {*} project
 * @param {Function} mediaUpload
 * @returns {*}
 */
const ProjectImage = ({ project, mediaUpload }) => {
  const styles = {};
  if (project.image && project.image.url) {
    styles.backgroundImage = `url(${project.image.url})`;
  }

  const onDrop = useCallback(acceptedFiles => {
    mediaUpload({
      file:   acceptedFiles[0],
      system: 'project_images'
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const classes = classNames('project-settings-banner', {
    'hover': isDragActive
  });

  return (
    <div
      className={classes}
      style={styles}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {(!project.image || !project.image.url) && (
        <div className="d-flex flex-column justify-content-center text-center">
          <div className="project-settings-banner-circle">
            <Icon name="image" size={2} far />
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
