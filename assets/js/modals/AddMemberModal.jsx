import React from 'react';
import PropTypes from 'prop-types';
import { Typeahead } from 'react-bootstrap-typeahead';
import { connect, mapDispatchToProps } from 'utils';
import { Form, Input, Checkbox } from 'components/forms';
import { Row, Column, Button } from 'components/bootstrap';
import { Modal } from 'components';
import * as userActions from 'actions/userActions';
import * as editorActions from 'actions/editorActions';
import * as formActions from 'actions/formActions';

const mapStateToProps = state => ({

});

@connect(
  mapStateToProps,
  mapDispatchToProps(userActions, editorActions, formActions)
)
export default class AddMemberModal extends React.PureComponent {
  static propTypes = {
    editorModal: PropTypes.func.isRequired,
    formChange:  PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   * @returns {*}
   */
  renderForm = () => {
    const { formChange } = this.props;

    return (
      <Form name="addMember">
        <Row className="gutter-bottom-sm">
          <Column>
            <Typeahead
              id="input-add-member-email"
              placeholder="Email address:"
              onInputChange={(value) => {
                formChange('addMember', 'email', value);
              }}
              options={[ /* Array of objects or strings */ ]}
            />
          </Column>
        </Row>
        <Row>
          <Column xl={4}>
            <Checkbox
              name="roleEditor"
              label="Editor"
              id="input-add-member-role-editor"
            />
          </Column>
          <Column xl={4}>
            <Checkbox
              name="roleGraphics"
              label="Graphics"
              id="input-add-member-role-graphics"
            />
          </Column>
          <Column xl={4}>
            <Checkbox
              name="roleLead"
              label="Lead"
              id="input-add-member-role-lead"
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
      <Button sm>Add</Button>
    );

    return (
      <Modal
        name="addMember"
        buttons={buttons}
        title="Add Team Member"
        icon="user"
      >
        {this.renderForm()}
      </Modal>
    );
  }
}
