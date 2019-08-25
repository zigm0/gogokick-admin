import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect, browser, objects, strings, mapDispatchToProps } from 'utils';
import { Container, Row, Column } from 'components/bootstrap';
import { Form, Input, Textarea } from 'components/forms';
import { Avatar, Icon, Button, Upload } from 'components';
import { formActions, userActions, uiActions } from 'actions';

const mapStateToProps = state => ({
  user:    state.user,
  profile: state.user.profile,
  form:    state.forms.profile
});

@withRouter
@connect(
  mapStateToProps,
  mapDispatchToProps(formActions, userActions, uiActions)
)
export default class Profile extends React.PureComponent {
  static propTypes = {
    user:        PropTypes.object,
    profile:     PropTypes.object,
    match:       PropTypes.object.isRequired,
    form:        PropTypes.object.isRequired,
    userSave:    PropTypes.func.isRequired,
    userProfile: PropTypes.func.isRequired,
    formChange:  PropTypes.func.isRequired,
    formChanges: PropTypes.func.isRequired,
    uiWorkspace: PropTypes.func.isRequired
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
    const { match, userProfile, uiWorkspace } = this.props;

    uiWorkspace('profile');
    userProfile(match.params.id);
  }

  /**
   * @param {*} prevProps
   */
  componentDidUpdate(prevProps) {
    const { user, profile, match, formChanges, userProfile } = this.props;
    const { profile: prevProfile, match: prevMatch } = prevProps;

    if (match.params.id !== prevMatch.params.id) {
      userProfile(match.params.id);
    } else if (profile.id && !prevProfile.id || profile.id !== prevProfile.id) {
      browser.title(profile.name);

      if (user.id === profile.id) {
        formChanges('profile', objects.merge(user, {
          socialTwitter:   user.social.twitter || '',
          socialYoutube:   user.social.youtube || '',
          socialFacebook:  user.social.facebook || '',
          socialInstagram: user.social.instagram || '',
          skills:          user.skills.join(', ')
        }));
      }
    }
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
    const { form, userSave } = this.props;

    userSave({
      name:   form.name,
      bio:    form.bio,
      avatar: form.avatar,
      skills: form.skills.split(',').map(s => $.trim(s)),
      social: {
        twitter:   form.socialTwitter || '',
        youtube:   form.socialYoutube || '',
        facebook:  form.socialFacebook || '',
        instagram: form.socialInstagram || ''
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
    const { profile } = this.props;
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
        <h2>{profile.name}</h2>
      </section>
    );
  };

  /**
   * @returns {*}
   */
  renderSocial = () => {
    const { profile } = this.props;
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
        {profile.social.twitter && (
          <a href="#" rel="noopener" target="_blank">
            <Icon name="twitter-square" className="profile-social-icon profile-social-icon-twitter" fab />
          </a>
        )}
        {profile.social.youtube && (
          <a href="#" rel="noopener" target="_blank">
            <Icon name="youtube-square" className="profile-social-icon profile-social-icon-youtube" fab />
          </a>
        )}
        {profile.social.facebook && (
          <a href="#" rel="noopener" target="_blank">
            <Icon name="facebook-square" className="profile-social-icon profile-social-icon-facebook" fab />
          </a>
        )}
        {profile.social.instagram && (
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
    const { profile } = this.props;
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
        {profile.skills.map((skill, i) => (
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
    const { profile } = this.props;
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
        {profile.bio}
      </section>
    );
  };

  /**
   * @returns {*}
   */
  renderAvatar = () => {
    const { form, profile } = this.props;
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
            <Avatar src={form.avatar} xl />
          </Upload>
        </div>
      );
    }

    return (
      <Avatar src={profile.avatar} xl />
    );
  };

  /**
   * @returns {null|Array}
   */
  renderButtons = () => {
    const { user, profile } = this.props;
    const { isEditing } = this.state;

    if (user.id !== profile.id) {
      return null;
    }

    const buttons = [];
    if (isEditing) {
      buttons.push(
        <Button
          key="save"
          icon="save"
          title="Save changes"
          className="btn-circle btn-profile-edit border-grey margin-right-sm"
          onClick={this.handleSaveClick}
        />
      );
      buttons.push(
        <Button
          key="cancel"
          icon="times"
          title="Cancel"
          className="btn-circle btn-profile-edit border-grey"
          onClick={this.handleEditClick}
        />
      );
    } else {
      buttons.push(
        <Button
          key="edit"
          icon="pencil-alt"
          title="Edit profile"
          className="btn-circle btn-profile-edit border-grey"
          onClick={this.handleEditClick}
        />
      );
    }

    return buttons;
  };

  /**
   * @returns {*}
   */
  render() {
    const { profile } = this.props;

    if (!profile.id) {
      return null;
    }

    return (
      <Container className="gutter-top">
        <div className="profile-header">
          <div>
            {this.renderButtons()}
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
      </Container>
    );
  }
}
