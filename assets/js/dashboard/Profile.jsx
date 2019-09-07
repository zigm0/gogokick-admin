import React from 'react';
import PropTypes from 'prop-types';
import ReactTags from 'react-tag-autocomplete';
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
      isEditing: false,
      skills:    []
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

      const skills = profile.skills.map(skill => (
        { id: skill, name: skill }
      ));
      this.setState({ skills });
    }
  }

  /**
   *
   */
  handleEditClick = () => {
    const { profile } = this.props;
    const { isEditing } = this.state;

    const skills = profile.skills.map(skill => (
      { id: skill, name: skill }
    ));

    this.setState({ isEditing: !isEditing, skills });
  };

  /**
   * @param {Event} e
   */
  handleSubmit = (e) => {
    const { form, userSave } = this.props;
    const { skills } = this.state;

    e.preventDefault();

    const newSkills = skills.map(s => s.name);

    userSave({
      name:   form.name,
      bio:    form.bio,
      avatar: form.avatar,
      skills: newSkills,
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
   * @param {*} skill
   */
  handleSkillAdd = (skill) => {
    const { skills } = this.state;

    this.setState({
      skills: [].concat(skills, skill)
    });
  };

  /**
   * @param {number} i
   */
  handleSkillRemove = (i) => {
    const { skills } = this.state;

    const newSkills = skills.slice(0);
    newSkills.splice(i, 1);

    this.setState({ skills: newSkills });
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
            type="url"
            name="socialTwitter"
            id="input-profile-social-twitter"
            label="Twitter"
            placeholder="https://"
          />
          <Input
            type="url"
            name="socialYoutube"
            id="input-profile-social-youtube"
            label="Youtube"
            placeholder="https://"
          />
          <Input
            type="url"
            name="socialFacebook"
            id="input-profile-social-facebook"
            label="Facebook"
            placeholder="https://"
          />
          <Input
            type="url"
            name="socialInstagram"
            id="input-profile-social-instagram"
            label="Instagram"
            placeholder="https://"
          />
        </section>
      );
    }

    const makeLink = (part) => {
      if (part.indexOf('http') === 0) {
        return part;
      }

      return `https://${part}`;
    };

    return (
      <section className="profile-section profile-section-social">
        {profile.social.twitter && (
          <a href={makeLink(profile.social.twitter)} rel="noopener noreferrer" target="_blank">
            <Icon
              name="twitter-square"
              className="social-icon social-icon-twitter margin-right-sm"
              fixed={false}
              fab
            />
          </a>
        )}
        {profile.social.youtube && (
          <a href={makeLink(profile.social.youtube)} rel="noopener noreferrer" target="_blank">
            <Icon
              name="youtube-square"
              className="social-icon social-icon-youtube margin-right-sm"
              fixed={false}
              fab
            />
          </a>
        )}
        {profile.social.facebook && (
          <a href={makeLink(profile.social.facebook)} rel="noopener noreferrer" target="_blank">
            <Icon
              name="facebook-square"
              className="social-icon social-icon-facebook margin-right-sm"
              fixed={false}
              fab
            />
          </a>
        )}
        {profile.social.instagram && (
          <a href={makeLink(profile.social.instagram)} rel="noopener noreferrer" target="_blank">
            <Icon
              name="instagram"
              className="social-icon social-icon-instagram margin-right-sm"
              fixed={false}
              fab
            />
          </a>
        )}
      </section>
    );
  };

  /**
   * @returns {*}
   */
  renderSkills = () => {
    const { isEditing, skills } = this.state;

    if (isEditing) {
      const suggestions = [
        { id: 'Copy Writer',  name: 'Copy Writer' },
        { id: 'Graphics',     name: 'Graphics' },
        { id: 'Video Editor', name: 'Video Editor' },
        { id: 'Voice Talent', name: 'Voice Talent' }
      ];

      return (
        <ReactTags
          tags={skills}
          suggestions={suggestions}
          handleDelete={this.handleSkillRemove}
          handleAddition={this.handleSkillAdd}
          placeholder="Add new skill"
          allowNew
        />
      );
    }

    return (
      <section className="profile-section profile-section-skills">
        {skills.map((skill, i) => (
          <div key={i} className="badge badge-success badge-skill margin-right-sm">
            {strings.ucWords(skill.name)}
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
          type="submit"
          title="Save changes"
          className="btn-circle btn-profile-save border-grey margin-right-sm"
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
        <Form name="profile" onSubmit={this.handleSubmit}>
          <div className="profile-header">
            <div>
              {this.renderButtons()}
            </div>
          </div>
          <div className="profile">
            <Row>
              <Column className="text-center" xl={5} md={12}>
                {this.renderAvatar()}
              </Column>
              <Column xl={7} md={12}>
                {this.renderName()}
                {this.renderSocial()}
                {this.renderSkills()}
                {this.renderBio()}
              </Column>
            </Row>
          </div>
        </Form>
      </Container>
    );
  }
}
