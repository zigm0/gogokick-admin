import React from 'react';
import PropTypes from 'prop-types';
import { connect, browser, objects, strings, mapDispatchToProps } from 'utils';
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
      isEditing: false
    };
  }

  /**
   *
   */
  componentDidMount() {
    const { user, formChanges } = this.props;

    browser.title('Profile');
    formChanges('profile', objects.merge(user, {
      socialTwitter:   user.social.twitter || '',
      socialYoutube:   user.social.youtube || '',
      socialFacebook:  user.social.facebook || '',
      socialInstagram: user.social.instagram || '',
      skills:          user.skills.join(', ')
    }));
  }

  /**
   *
   */
  handleEditClick = () => {
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
      avatar: profile.avatar,
      skills: profile.skills.split(',').map(s => $.trim(s)),
      social: {
        twitter:   profile.socialTwitter || '',
        youtube:   profile.socialYoutube || '',
        facebook:  profile.socialFacebook || '',
        instagram: profile.socialInstagram || ''
      }
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
            label="Name"
          />
        </section>
      );
    }

    return (
      <section className="profile-section profile-section-name">
        <h2>{user.name}</h2>
      </section>
    );
  };

  /**
   * @returns {*}
   */
  renderSocial = () => {
    const { user } = this.props;
    const { isEditing } = this.state;

    if (isEditing) {
      return (
        <section className="profile-section profile-section-social">
          <Input
            name="socialTwitter"
            id="input-profile-social-twitter"
            label="Twitter"
          />
          <Input
            name="socialYoutube"
            id="input-profile-social-youtube"
            label="Youtube"
          />
          <Input
            name="socialFacebook"
            id="input-profile-social-facebook"
            label="Facebook"
          />
          <Input
            name="socialInstagram"
            id="input-profile-social-instagram"
            label="Instagram"
          />
        </section>
      );
    }

    return (
      <section className="profile-section profile-section-social">
        {user.social.twitter && (
          <a href="#" rel="noopener" target="_blank">
            <Icon name="twitter-square" className="profile-social-icon profile-social-icon-twitter" fab />
          </a>
        )}
        {user.social.youtube && (
          <a href="#" rel="noopener" target="_blank">
            <Icon name="youtube-square" className="profile-social-icon profile-social-icon-youtube" fab />
          </a>
        )}
        {user.social.facebook && (
          <a href="#" rel="noopener" target="_blank">
            <Icon name="facebook-square" className="profile-social-icon profile-social-icon-facebook" fab />
          </a>
        )}
        {user.social.instagram && (
          <a href="#" rel="noopener" target="_blank">
            <Icon name="instagram" className="profile-social-icon profile-social-icon-instagram" fab />
          </a>
        )}
      </section>
    );
  };

  /**
   * @returns {*}
   */
  renderSkills = () => {
    const { user } = this.props;
    const { isEditing } = this.state;

    if (isEditing) {
      return (
        <Input
          name="skills"
          id="input-profile-skills"
          label="Skills"
          help="Comma separated list of words."
        />
      );
    }

    return (
      <section className="profile-section profile-section-skills">
        {user.skills.map((skill, i) => (
          <div key={i} className="badge badge-success badge-skill margin-right-sm">
            {strings.ucWords(skill)}
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
            style={{ height: 200 }}
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
                {isEditing ? (
                  <>
                    <Button
                      icon="save"
                      title="Save changes"
                      className="btn-circle btn-profile-edit border-grey margin-right-sm"
                      onClick={this.handleSaveClick}
                    />
                    <Button
                      icon="times"
                      title="Cancel"
                      className="btn-circle btn-profile-edit border-grey"
                      onClick={this.handleEditClick}
                    />
                  </>
                ) : (
                  <Button
                    icon="pencil-alt"
                    title="Edit profile"
                    className="btn-circle btn-profile-edit border-grey"
                    onClick={this.handleEditClick}
                  />
                )}
              </div>
            </div>
            <div className="profile border-grey">
              <Row>
                <Column className="text-center" xl={5} md={12}>
                  {this.renderAvatar()}
                </Column>
                <Column xl={7} md={12}>
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
