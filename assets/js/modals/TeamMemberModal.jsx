import React from 'react';
import PropTypes from 'prop-types';
import { connect, history, constants, objects, acl, mapDispatchToProps } from 'utils';
import { Form, Checkbox } from 'components/forms';
import { Row, Column, Button } from 'components/bootstrap';
import { Modal } from 'components';
import { formActions, teamActions, uiActions } from 'actions';

const mapStateToProps = state => ({
  teamMember:   state.ui.modalMeta.teamMember,
  meTeamMember: state.editor.meTeamMember,
  form:         state.forms.teamMember
});

@connect(
  mapStateToProps,
  mapDispatchToProps(formActions, teamActions, uiActions)
)
export default class TeamMemberModal extends React.PureComponent {
  static propTypes = {
    form:             PropTypes.object.isRequired,
    meTeamMember:     PropTypes.object.isRequired,
    teamMember:       PropTypes.object,
    formChanges:      PropTypes.func.isRequired,
    teamMemberUpdate: PropTypes.func.isRequired,
    uiModal:          PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   *
   */
  componentDidMount() {
    this.handleUpdate();
  }

  /**
   * @param {*} prevProps
   */
  componentDidUpdate(prevProps) {
    const { teamMember } = this.props;

    if (!prevProps.teamMember && teamMember) {
      this.handleUpdate();
    } else if (teamMember && prevProps.teamMember.id !== teamMember.id) {
      this.handleUpdate();
    }
  }

  /**
   *
   */
  handleUpdate = () => {
    const { teamMember, formChanges } = this.props;

    if (!teamMember) {
      return;
    }

    const { roles } = teamMember;

    formChanges('teamMember', {
      roleWriter:   roles.includes(constants.projectRole('writer')),
      roleLead:     roles.includes(constants.projectRole('lead')),
      roleGraphics: roles.includes(constants.projectRole('graphics')),
      roleVideo:    roles.includes(constants.projectRole('video')),
      roleAudio:    roles.includes(constants.projectRole('audio')),
    });
  };

  /**
   *
   */
  handleSaveClick = () => {
    const { teamMember, form, teamMemberUpdate, uiModal } = this.props;

    const roles = [];
    if (form.roleWriter) {
      roles.push(constants.projectRole('writer'));
    }
    if (form.roleLead) {
      roles.push(constants.projectRole('lead'));
    }
    if (form.roleGraphics) {
      roles.push(constants.projectRole('graphics'));
    }
    if (form.roleVideo) {
      roles.push(constants.projectRole('video'));
    }
    if (form.roleAudio) {
      roles.push(constants.projectRole('audio'));
    }

    teamMemberUpdate(objects.merge(teamMember, {
      roles
    }));
    uiModal({
      modal: 'teamMember',
      open:  false
    })
  };

  /**
   *
   */
  handleProfileClick = () => {
    const { teamMember, uiModal } = this.props;

    uiModal({
      modal: 'teamMember',
      open:  false
    });

    history.push(`/profile/${teamMember.user.id}`);
  };

  /**
   * @returns {*}
   */
  renderForm = () => {
    const { teamMember, meTeamMember } = this.props;

    const isOwner = teamMember.roles.includes(constants.projectRole('owner'));
    const canEdit = acl(meTeamMember.roles, 'edit', 'teamMember');

    return (
      <Form name="teamMember">
        <Row>
          <Column xl={4}>
            <Checkbox
              name="roleLead"
              label="Lead"
              id="input-team-member-role-lead"
              disabled={isOwner || !canEdit}
            />
          </Column>
          <Column xl={4}>
            <Checkbox
              name="roleWriter"
              label="Writer"
              id="input-team-member-role-writer"
              disabled={isOwner || !canEdit}
            />
          </Column>
          <Column xl={4}>
            <Checkbox
              name="roleGraphics"
              label="Graphics"
              id="input-team-member-role-graphics"
              disabled={isOwner || !canEdit}
            />
          </Column>
        </Row>
        <Row>
          <Column xl={4}>
            <Checkbox
              name="roleVideo"
              label="Video"
              id="input-team-member-role-video"
              disabled={isOwner || !canEdit}
            />
          </Column>
          <Column xl={4}>
            <Checkbox
              name="roleAudio"
              label="Audio"
              id="input-team-member-role-audio"
              disabled={isOwner || !canEdit}
            />
          </Column>
        </Row>
      </Form>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    const { teamMember, meTeamMember } = this.props;

    if (!teamMember) {
      return null;
    }

    const buttons = [];
    if (!teamMember.roles.includes(constants.projectRole('owner')) && acl(meTeamMember.roles, 'delete', 'teamMember')) {
      buttons.push(
        <Button
          key="remove"
          className="modal-delete-btn"
          theme="danger"
        >
          Remove
        </Button>
      )
    }

    buttons.push(
      <Button key="profile" onClick={this.handleProfileClick}>
        Profile
      </Button>
    );
    if (acl(meTeamMember.roles, 'edit', 'teamMember')) {
      buttons.push(
        <Button key="save" onClick={this.handleSaveClick}>
          Save
        </Button>
      );
    }

    const title = (
      <div>
        {teamMember.user.name}
        <small>{teamMember.user.email}</small>
      </div>
    );

    return (
      <Modal
        name="teamMember"
        buttons={buttons}
        title={title}
        avatar={teamMember.user.avatar}
      >
        {this.renderForm()}
      </Modal>
    );
  }
}
