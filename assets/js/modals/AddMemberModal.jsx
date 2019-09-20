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
    form:        PropTypes.object.isRequired,
    formReset:   PropTypes.func.isRequired,
    formChange:  PropTypes.func.isRequired,
    formChanges: PropTypes.func.isRequired,
    teamInvite:  PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.input = React.createRef();

    this.state = {
      error: ''
    };
  }

  /**
   *
   */
  handleAddClick = () => {
    const { form, teamInvite, formChange } = this.props;
    const { email, roleWriter, roleGraphics, roleLead, roleVideo, roleAudio } = form;
    let { roleGuest } = form;

    if (!roleWriter && !roleGraphics && !roleLead && !roleVideo && !roleAudio) {
      roleGuest = true;
      formChange('addMember', 'roleGuest', true);
    }
    if (!form.email) {
      this.setState({ error: 'You must enter an email address.' });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      this.setState({ error: 'Invalid email address.' });
      return;
    }

    teamInvite({
      email,
      roleWriter,
      roleGraphics,
      roleLead,
      roleVideo,
      roleAudio,
      roleGuest
    });

    this.setState({ error: '' });
  };

  /**
   *
   */
  handleOpened = () => {
    this.input.current.focus();
  };

  /**
   *
   */
  handleClosed = () => {
    const { formReset } = this.props;

    this.setState({ error: '' });
    formReset('addMember');
  };

  /**
   * @param {Event} e
   * @param {string} value
   * @param {string} name
   */
  handleFormChange = (e, value, name) => {
    const { formChange, formChanges } = this.props;

    if (['roleWriter', 'roleLead', 'roleGraphics', 'roleVideo', 'roleAudio'].indexOf(name) !== -1 && value) {
      formChange('addMember', 'roleGuest', false);
    } else if (name === 'roleGuest' && value) {
      formChanges('addMember', {
        roleVideo:    false,
        roleAudio:    false,
        roleWriter:   false,
        roleLead:     false,
        roleGraphics: false
      });
    }
  };

  /**
   * @returns {*}
   */
  renderForm = () => {
    const { error } = this.state;

    return (
      <Form name="addMember" onChange={this.handleFormChange}>
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}
        <Row className="gutter-bottom-sm">
          <Column>
            <Input
              name="email"
              label="Email address"
              id="input-add-member-email"
              ref={this.input}
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
          <Column xl={4}>
            <Checkbox
              name="roleGuest"
              label="Guest"
              id="input-team-member-role-guest"
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
        onOpened={this.handleOpened}
        onClosed={this.handleClosed}
      >
        {this.renderForm()}
      </Modal>
    );
  }
}
