import React from 'react';
import PropTypes from 'prop-types';
import { connect, constants, objects, mapDispatchToProps } from 'utils';
import { Form, Checkbox } from 'components/forms';
import { Row, Column, Button } from 'components/bootstrap';
import { Modal } from 'components';
import { formActions, teamActions, uiActions } from 'actions';

const mapStateToProps = state => ({
  teamMember: state.editor.teamMember,
  form:       state.forms.teamMember
});

@connect(
  mapStateToProps,
  mapDispatchToProps(formActions, teamActions, uiActions)
)
export default class TeamMemberModal extends React.PureComponent {
  static propTypes = {
    form:             PropTypes.object.isRequired,
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
    } else if (prevProps.teamMember.id !== teamMember.id) {
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
   * @returns {*}
   */
  renderForm = () => {
    return (
      <Form name="teamMember">
        <Row>
          <Column xl={4}>
            <Checkbox
              name="roleLead"
              label="Lead"
              id="input-team-member-role-lead"
            />
          </Column>
          <Column xl={4}>
            <Checkbox
              name="roleWriter"
              label="Writer"
              id="input-team-member-role-writer"
            />
          </Column>
          <Column xl={4}>
            <Checkbox
              name="roleGraphics"
              label="Graphics"
              id="input-team-member-role-graphics"
            />
          </Column>
        </Row>
        <Row>
          <Column xl={4}>
            <Checkbox
              name="roleVideo"
              label="Video"
              id="input-team-member-role-video"
            />
          </Column>
          <Column xl={4}>
            <Checkbox
              name="roleAudio"
              label="Audio"
              id="input-team-member-role-audio"
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
    const { teamMember } = this.props;

    if (!teamMember) {
      return null;
    }

    const buttons = (
      <>
        <Button className="modal-delete-btn" theme="danger" sm>
          Remove Team Member
        </Button>
        <Button onClick={this.handleSaveClick} sm>
          Save
        </Button>
      </>
    );

    return (
      <Modal
        name="teamMember"
        buttons={buttons}
        title={teamMember.user.name}
        avatar={teamMember.user.avatar}
      >
        {this.renderForm()}
      </Modal>
    );
  }
}
