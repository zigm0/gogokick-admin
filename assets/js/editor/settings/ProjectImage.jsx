import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'

/**
 *
 * @param {*} project
 * @param {Function} mediaUpload
 * @returns {*}
 */
const ProjectImage = ({ project, mediaUpload }) => {
  let image = '/images/block-placeholder-image.png';
  if (project.image && project.image.url) {
    image = project.image.url;
  }

  const onDrop = useCallback(acceptedFiles => {
    mediaUpload({
      file:   acceptedFiles[0],
      system: 'project_images'
    });
  }, []);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

  return (
    <div
      style={{ backgroundImage: `url(${image})` }}
      className="project-settings-banner"
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>
  )
};

export default ProjectImage;
