import React from 'react';
import PropTypes from 'prop-types';
import { connect, mapDispatchToProps } from 'utils';
import { Form, Input, Checkbox } from 'components/forms';
import { Row, Column, Button } from 'components/bootstrap';
import { Modal } from 'components';
import { formActions, userActions } from 'actions';

const mapStateToProps = state => ({
  teamMember: state.editor.teamMember
});

@connect(
  mapStateToProps,
  mapDispatchToProps(userActions, formActions)
)
export default class TeamMemberModal extends React.PureComponent {
  static propTypes = {
    teamMember: PropTypes.object
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
    const { teamMember, formChange, formChanges } = this.props;

    if (!teamMember) {
      return;
    }

    formChanges('teamMember', {
      roleEditor:   false,
      roleLead:     false,
      roleGraphics: false
    });

    teamMember.projectRoles.forEach((role) => {
      formChange('teamMember', `role${role}`, true);
    });
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
              name="roleEditor"
              label="Editor"
              id="input-team-member-role-editor"
            />
          </Column>
          <Column xl={4}>
            <Checkbox
              name="roleGraphics"
              label="Graphics"
              id="input-team-member-role-graphics"
            />
          </Column>
          <Column xl={4}>
            <Checkbox
              name="roleLead"
              label="Lead"
              id="input-team-member-role-lead"
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
        <Button sm>Save</Button>
      </>
    );

    return (
      <Modal
        name="teamMember"
        buttons={buttons}
        title={teamMember.name}
        avatar={teamMember.avatar}
      >
        {this.renderForm()}
      </Modal>
    );
  }
}
