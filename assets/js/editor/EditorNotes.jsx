import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Moment from 'react-moment';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect, acl, mapDispatchToProps } from 'utils';
import { Form, Textarea } from 'components/forms';
import { Button } from 'components/bootstrap';
import { Avatar, Icon } from 'components';
import { notesActions, formActions } from 'actions';

const mapStateToProps = state => ({
  notes:         state.notes.notes,
  isVisible:     state.notes.isVisible,
  formValues:    state.forms.notes,
  activeBlockID: state.editor.activeBlockID,
  meTeamMember:  state.editor.meTeamMember
});

@connect(
  mapStateToProps,
  mapDispatchToProps(notesActions, formActions)
)
export default class EditorNotes extends React.PureComponent {
  static propTypes = {
    notes:         PropTypes.array.isRequired,
    isVisible:     PropTypes.bool.isRequired,
    formValues:    PropTypes.object.isRequired,
    meTeamMember:  PropTypes.object.isRequired,
    notesFetch:    PropTypes.func.isRequired,
    notesSave:     PropTypes.func.isRequired,
    notesDelete:   PropTypes.func.isRequired,
    formChange:    PropTypes.func.isRequired,
    activeBlockID: PropTypes.number.isRequired
  };

  static defaultProps = {};

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.message = React.createRef();
    this.notes   = React.createRef();
  }

  /**
   * @param {*} prevProps
   */
  componentDidUpdate(prevProps) {
    const { notes, activeBlockID, isVisible, notesFetch } = this.props;
    const { notes: prevNotes, isVisible: prevIsVisible } = prevProps;

    if (isVisible && activeBlockID && isVisible !== prevIsVisible) {
      notesFetch(activeBlockID);
      setTimeout(() => {
        this.message.current.focus();
      }, 500);
    }
    if (notes.length !== prevNotes.length) {
      this.notes.current.scrollToBottom();
    }
  }

  /**
   * @param {Event} e
   */
  handleFormSubmit = (e) => {
    const { activeBlockID, formValues, formChange, notesSave } = this.props;

    e.preventDefault();
    formChange('notes', 'message', '');
    notesSave(activeBlockID, formValues.message);
    setTimeout(() => {
      this.message.current.focus();
    }, 500);
  };

  /**
   * @param {Event} e
   * @param {*} note
   */
  handleDeleteClick = (e, note) => {
    const { notesDelete } = this.props;

    if (confirm('Are you sure you want to delete this note?')) {
      notesDelete(note.id);
    }
  };

  /**
   * @param {Event} e
   */
  handleMessageKeyUp = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.handleFormSubmit(e);
    }
  };

  /**
   * @returns {*}
   */
  renderForm = () => {
    return (
      <Form name="notes" className="editor-notes-form" onSubmit={this.handleFormSubmit}>
        <Textarea
          ref={this.message}
          name="message"
          id="notes-message-input"
          placeholder="Add your message..."
          onKeyUp={this.handleMessageKeyUp}
        />
        <Button theme="success" block>
          Save
        </Button>
      </Form>
    );
  };

  /**
   * @returns {*}
   */
  renderNotes = () => {
    const { notes, meTeamMember } = this.props;

    if (!meTeamMember.user) {
      return null;
    }

    return (
      <Scrollbars ref={this.notes}>
        {notes.length === 0 ? (
          <div className="editor-note-items editor-note-items-empty">
            This block does not have any notes.
            <Icon name="comment-alt" size={3} />
          </div>
        ) : (
          <ul className="editor-note-items">
            {notes.map(note => (
              <li key={note.id} className="editor-note-item">
                {(meTeamMember.user.id === note.user.id || acl(meTeamMember.roles, 'delete', 'notes')) && (
                  <Icon
                    name="times"
                    className="editor-note-item-delete-icon"
                    title="Delete"
                    onClick={e => this.handleDeleteClick(e, note)}
                  />
                )}
                <div className="editor-note-item-avatar">
                  <Avatar src={note.user.avatar} sm />
                  <div className="editor-note-item-details">
                    <div className="editor-note-item-avatar-name">
                      {note.user.name}
                    </div>
                    <Moment fromNow>
                      {note.dateCreated}
                    </Moment>
                  </div>
                </div>
                <div className="editor-note-item-message">
                  {note.text}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Scrollbars>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    const { isVisible } = this.props;

    const classes = classNames('editor-notes', {
      'editor-notes-visible': isVisible
    });

    return (
      <div className={classes}>
        <div className="editor-notes-body">
          {this.renderNotes()}
          {this.renderForm()}
        </div>
      </div>
    );
  }
}
