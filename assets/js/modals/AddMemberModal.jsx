import React from 'react';
import PropTypes from 'prop-types';
import { connect, mapDispatchToProps } from 'utils';
import { Form, Checkbox, Input } from 'components/forms';
import { Row, Column, Button } from 'components/bootstrap';
import { Modal } from 'components';
import { formActions, teamActions } from 'actions';

const mapStateToProps = state => ({
  form: state.forms.addMember
});

@connect(
  mapStateToProps,
  mapDispatchToProps(teamActions, formActions)
)
export default class AddMemberModal extends React.PureComponent {
  static propTypes = {
    form:       PropTypes.object.isRequired,
    formChange: PropTypes.func.isRequired,
    teamInvite: PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   *
   */
  handleAddClick = () => {
    const { form, teamInvite } = this.props;
    const { email, roleEditor, roleGraphics, roleLead } = form;

    if (form.email) {
      teamInvite({
        email,
        roleEditor,
        roleGraphics,
        roleLead
      });
    }
  };

  /**
   * @returns {*}
   */
  renderForm = () => {
    return (
      <Form name="addMember">
        <Row className="gutter-bottom-sm">
          <Column>
            <Input
              name="email"
              label="Email address"
              id="input-add-member-email"
            />
          </Column>
        </Row>
        <Row>
          <Column xl={4}>
            <Checkbox
              name="roleLead"
              label="Lead"
              id="input-add-member-role-lead"
            />
          </Column>
          <Column xl={4}>
            <Checkbox
              name="roleWriter"
              label="Writer"
              id="input-add-member-role-writer"
            />
          </Column>
          <Column xl={4}>
            <Checkbox
              name="roleGraphics"
              label="Graphics"
              id="input-add-member-role-graphics"
            />
          </Column>
        </Row>
        <Row>
          <Column xl={4}>
            <Checkbox
              name="roleVideo"
              label="Video"
              id="input-add-member-role-video"
            />
          </Column>
          <Column xl={4}>
            <Checkbox
              name="roleAudio"
              label="Audio"
              id="input-add-member-role-audio"
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
    const buttons = (
      <Button onClick={this.handleAddClick}>Add</Button>
    );

    return (
      <Modal
        name="addMember"
        buttons={buttons}
        title="Invite Team Member"
        icon="user"
      >
        {this.renderForm()}
      </Modal>
    );
  }
}
