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
    formReset:  PropTypes.func.isRequired,
    formChange: PropTypes.func.isRequired,
    teamInvite: PropTypes.func.isRequired
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
    const { form, teamInvite } = this.props;
    const { email, roleWriter, roleGraphics, roleLead, roleVideo, roleAudio } = form;

    if (!roleWriter && !roleGraphics && !roleLead && !roleVideo && !roleAudio) {
      this.setState({ error: 'You must select at least one role.' });
      return;
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
      roleAudio
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
   * @returns {*}
   */
  renderForm = () => {
    const { error } = this.state;

    return (
      <Form name="addMember">
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
