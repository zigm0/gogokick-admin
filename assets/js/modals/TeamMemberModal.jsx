import React from 'react';
import PropTypes from 'prop-types';
import { connect, mapDispatchToProps } from 'utils';
import { Form, Input } from 'components/forms';
import { Modal } from 'components';
import * as userActions from 'actions/userActions';
import * as editorActions from 'actions/editorActions';
import * as formActions from 'actions/formActions';

const mapStateToProps = state => ({
  teamMember: state.editor.teamMember
});

@connect(
  mapStateToProps,
  mapDispatchToProps(userActions, editorActions, formActions)
)
export default class TeamMemberModal extends React.PureComponent {
  static propTypes = {
    teamMember:  PropTypes.object,
    editorModal: PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   * @returns {*}
   */
  render() {
    const { teamMember } = this.props;

    if (!teamMember) {
      return null;
    }

    return (
      <Modal
        name="teamMember"
        title={teamMember.name}
        avatar={teamMember.avatar}
      >
        {teamMember.role}
      </Modal>
    );
  }
}
