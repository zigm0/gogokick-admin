import React from 'react';
import PropTypes from 'prop-types';
import { connect, browser, mapDispatchToProps } from 'utils';
import { Container, Row, Column } from 'components/bootstrap';
import { Form, Input, Textarea } from 'components/forms';
import { Avatar, Icon, Button, Upload } from 'components';
import { formActions, userActions } from 'actions';

const mapStateToProps = state => ({
  user:    state.user,
  profile: state.forms.profile
});

@connect(
  mapStateToProps,
  mapDispatchToProps(formActions, userActions)
)
export default class EditorProfile extends React.PureComponent {
  static propTypes = {
    user:        PropTypes.object,
    profile:     PropTypes.object.isRequired,
    userSave:    PropTypes.func.isRequired,
    formChange:  PropTypes.func.isRequired,
    formChanges: PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);

    this.state = {
      isEditing: true
    };
  }

  /**
   *
   */
  componentDidMount() {
    const { user, formChanges } = this.props;

    browser.title('Profile');
    formChanges('profile', user);
  }

  /**
   * @param {Event} e
   * @param {string} section
   */
  handleEditClick = (e, section) => {
    const { isEditing } = this.state;

    this.setState({ isEditing: !isEditing });
  };

  /**
   *
   */
  handleSaveClick = () => {
    const { profile, userSave } = this.props;

    userSave({
      name:   profile.name,
      bio:    profile.bio,
      avatar: profile.avatar
    });
    this.setState({ isEditing: false });
  };

  /**
   * @param {*} media
   */
  handleAvatarUploaded = (media) => {
    const { formChange } = this.props;

    formChange('profile', 'avatar', media.url);
  };

  /**
   * @returns {*}
   */
  renderName = () => {
    const { user } = this.props;
    const { isEditing } = this.state;

    if (isEditing) {
      return (
        <section className="profile-section profile-section-name">
          <Input
            name="name"
            id="input-profile-name"
          />
        </section>
      );
    }

    return (
      <section className="profile-section profile-section-name">
        {user.name}
      </section>
    );
  };

  /**
   * @returns {*}
   */
  renderSocial = () => {
    const { user } = this.props;

    return (
      <section className="profile-section profile-section-social">
        social
      </section>
    );
  };

  /**
   * @returns {*}
   */
  renderSkills = () => {
    const { user } = this.props;

    return (
      <section className="profile-section profile-section-skills">
        {user.skills.map((skill, i) => (
          <div key={i} className="badge badge-primary">
            {skill}
          </div>
        ))}
      </section>
    );
  };

  /**
   * @returns {*}
   */
  renderBio = () => {
    const { user } = this.props;
    const { isEditing } = this.state;

    if (isEditing) {
      return (
        <section className="profile-section profile-section-bio">
          <h4>Bio</h4>
          <Textarea
            name="bio"
            id="input-profile-bio"
          />
        </section>
      );
    }

    return (
      <section className="profile-section profile-section-bio">
        <h4>Bio</h4>
        {user.bio}
      </section>
    );
  };

  /**
   * @returns {*}
   */
  renderAvatar = () => {
    const { profile } = this.props;
    const { isEditing } = this.state;

    if (isEditing) {
      const cropOptions = {
        width:  200,
        height: 200
      };

      return (
        <div className="profile-avatar-container">
          <Upload
            maxSizeMB={2}
            accept="image/*"
            system="avatars"
            cropOptions={cropOptions}
            onUploaded={this.handleAvatarUploaded}
            cropping
          >
            <Avatar src={profile.avatar} xl />
          </Upload>
        </div>
      );
    }

    return (
      <Avatar src={profile.avatar} xl />
    );
  };

  /**
   * @returns {*}
   */
  render() {
    const { isEditing } = this.state;

    return (
      <Container className="gutter-top">
        <Row>
          <Column xl={8} offsetXl={2}>
            <div className="profile-header">
              <h2>Profile</h2>
              <div>
                {isEditing && (
                  <Button icon="save" className="btn-circle btn-profile-edit" onClick={this.handleSaveClick} />
                )}
                <Button icon="pencil-alt" className="btn-circle btn-profile-edit" onClick={this.handleEditClick} />
              </div>
            </div>
            <div className="profile">
              <Row>
                <Column xl={6} md={12}>
                  {this.renderAvatar()}
                </Column>
                <Column xl={6} md={12}>
                  <Form name="profile">
                    {this.renderName()}
                    {this.renderSocial()}
                    {this.renderSkills()}
                    {this.renderBio()}
                  </Form>
                </Column>
              </Row>
            </div>
          </Column>
        </Row>
      </Container>
    );
  }
}
