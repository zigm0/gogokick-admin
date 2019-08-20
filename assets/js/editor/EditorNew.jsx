import React from 'react';
import PropTypes from 'prop-types';
import { connect, constants, history, mapDispatchToProps } from 'utils';
import { Container, Row, Column, Button } from 'components/bootstrap';
import { Form, Input, Checkbox } from 'components/forms';
import { ImageUpload } from 'components';
import * as mediaActions from 'actions/mediaActions';
import * as formActions from 'actions/formActions';
import * as projectActions from 'actions/projectActions';

const mapStateToProps = state => ({
  user:        state.user,
  newProject:  state.forms.newProject,
  isUploading: state.media.isUploading
});

@connect(
  mapStateToProps,
  mapDispatchToProps(mediaActions, formActions, projectActions)
)
export default class EditorNew extends React.PureComponent {
  static propTypes = {
    user:        PropTypes.object.isRequired,
    newProject:  PropTypes.object.isRequired,
    isUploading: PropTypes.bool.isRequired,
    mediaUpload: PropTypes.func.isRequired,
    formChange:  PropTypes.func.isRequired,
    projectNew:  PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      media: {}
    };
  }

  /**
   *
   */
  componentDidMount() {
    const { user } = this.props;

    if (!user.isAuthenticated) {
      history.push('/editor');
    }
  }

  /**
   * @param {Event} e
   */
  handleSubmit = (e) => {
    const { newProject, projectNew } = this.props;

    e.preventDefault();
    projectNew(newProject);
  };

  /**
   * @param {File} file
   */
  handleUpload = (file) => {
    const { mediaUpload, formChange } = this.props;

    mediaUpload({
      file,
      system:     'project_images',
      onComplete: (resp) => {
        formChange('newProject', 'pictureURL', resp.url);
        this.setState({
          media: {
            url: resp.url
          }
        });
      }
    });
  };

  /**
   * @returns {*}
   */
  render() {
    const { newProject, isUploading } = this.props;
    const { media } = this.state;

    return (
      <Container className="editor-new">
        <Form name="newProject" onSubmit={this.handleSubmit} required>
          <Row>
            <Column xl={8} offsetXl={2}>
              <h3>
                Which platform will you be raising money on?
              </h3>
              <Row className="gutter-bottom">
                <Column xl={6} xs={12}>
                  <Row>
                    <Column xs={4}>
                      <img className="editor-new-logo" src="/images/indiegogo-logo-square.jpg" alt="Indiegogo" />
                    </Column>
                    <Column xs={6} className="d-flex align-items-center">
                      <Checkbox
                        name="campaignType"
                        id="input-editor-new-indiegogo"
                        label="Indiegogo"
                        value={constants.campaignType('indiegogo')}
                        radio
                      />
                    </Column>
                  </Row>
                </Column>
                <Column xl={6} xs={12}>
                  <Row>
                    <Column xs={4}>
                      <img className="editor-new-logo" src="/images/kickstarter-logo-square.jpg" alt="Kickstarter" />
                    </Column>
                    <Column xs={6} className="d-flex align-items-center">
                      <Checkbox
                        name="campaignType"
                        id="input-editor-new-kickstarter"
                        label="Kickstarter"
                        value={constants.campaignType('kickstarter')}
                        radio
                      />
                    </Column>
                  </Row>
                </Column>
              </Row>
              <Row>
                <Column>
                  <p>
                    Our building tools are slightly different depending ont he platform. If you&apos;re
                    not sure what platform is best for your project <a href="#">read this</a>.
                  </p>
                </Column>
              </Row>
              <Row>
                <Column>
                  <h3>
                    Project Image
                  </h3>
                  <ImageUpload
                    media={media}
                    isUploading={isUploading}
                    onDrop={this.handleUpload}
                    className="project-settings-banner"
                  />
                  <p>
                    Add an image that clearly represents your project.
                  </p>
                  <p>
                    Choose one that looks good at different sizes. It will appear in different sizes
                    in different places: on your project page, across
                    the {newProject.campaignType === 'kickstarter' ? 'Kickstarter' : 'Indiegogo'} website
                    and mobile apps, and (when shared) on social channels.
                  </p>
                  <p>
                    You may want to avoid including banners, badges, and text because they may not be legible
                    at smaller sizes.
                  </p>
                  <p>
                    Your image should be at least 1024x576 pixels. It will be cropped to a 16:9 ratio.
                  </p>
                </Column>
              </Row>
              <Row>
                <Column>
                  <h3>
                    Project Title
                  </h3>
                  <Input
                    name="name"
                    id="input-editor-new-name"
                  />
                  <p>
                    Write a clear, brief title that helps people quickly understand the gist of your
                    project.
                  </p>
                  <h3>
                    Project Subtitle
                  </h3>
                  <Input
                    name="subtitle"
                    id="input-editor-new-sub-title"
                  />
                  <p>
                    This will appear below the title ad it&apos;s a chance to tell a little more
                    about your project.
                  </p>
                </Column>
              </Row>
              <Row className="gutter-bottom">
                <Column>
                  <Button theme="success" block>
                    Save
                  </Button>
                </Column>
              </Row>
            </Column>
          </Row>
        </Form>
      </Container>
    );
  }
}
