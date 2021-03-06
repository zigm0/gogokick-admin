import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Moment from 'react-moment';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect, strings, video, acl, mapDispatchToProps } from 'utils';
import { Form, Textarea } from 'components/forms';
import { Button } from 'components/bootstrap';
import { Avatar, Icon, Loading } from 'components';
import { notesActions, formActions } from 'actions';
import 'autolink-js';

const mapStateToProps = state => ({
  notes:         state.notes.notes,
  isBusy:        state.notes.isBusy,
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
    isBusy:        PropTypes.bool.isRequired,
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
    this.message         = React.createRef();
    this.notes           = React.createRef();
    this.attachmentInput = React.createRef();

    this.state = {
      attachment: null
    };
  }

  /**
   *
   */
  componentDidMount() {
    this.attachmentInput.current.addEventListener('change', this.handleAttachChange, false);
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
   *
   */
  componentWillUnmount() {
    this.attachmentInput.current.removeEventListener('change', this.handleAttachChange, false);
  }

  /**
   * @param {Event} e
   */
  handleFormSubmit = (e) => {
    const { activeBlockID, formValues, formChange, notesSave } = this.props;
    const { attachment } = this.state;

    e.preventDefault();
    formChange('notes', 'message', '');
    notesSave(activeBlockID, formValues.message, attachment);
    setTimeout(() => {
      this.message.current.focus();
      this.attachmentInput.current.value = '';
      this.setState({ attachment: null });
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
   * @param {*} note
   */
  handleQuoteClick = (e, note) => {
    const { formChange } = this.props;
    let { text } = note;

    const rx = new RegExp('^>([^\n]+)$', 'm'); // eslint-disable-line
    const matches = text.match(rx);
    if (matches) {
      text = text.replace(matches[0], '').trim();
    }

    formChange('notes', 'message', `> ${text + "\n"}`);
    setTimeout(() => {
      this.message.current.focus();
    }, 200);
  };

  /**
   * @param {Event} e
   */
  handleMessageKeyUp = (e) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      const { value } = e.target;

      if (value[0] !== '>' || (value[0] === '>' && value.indexOf("\n") !== -1)) {
        e.preventDefault();
        this.handleFormSubmit(e);
      }
    }
  };

  /**
   * @param {Event} e
   */
  handleAttachClick = (e) => {
    e.preventDefault();
    this.attachmentInput.current.click();
  };

  /**
   * @param {Event} e
   */
  handleAttachChange = (e) => {
    this.setState({
      attachment: e.target.files[0]
    });
  };

  /**
   * @returns {*}
   */
  renderForm = () => {
    const { isBusy } = this.props;
    const { attachment } = this.state;

    return (
      <Form name="notes" className="editor-notes-form" onSubmit={this.handleFormSubmit}>
        <input type="file" ref={this.attachmentInput} style={{ width: 0, height: 0 }}  disabled={isBusy} />
        {attachment && (
          <div className="editor-notes-form-attachment">
            {strings.truncate(attachment.name, 35)}
          </div>
        )}
        <Textarea
          ref={this.message}
          name="message"
          id="notes-message-input"
          formGroupClassName="flex-grow-1 gutter-bottom-sm"
          placeholder="Add your message..."
          onKeyDown={this.handleMessageKeyUp}
          disabled={isBusy}
        />
        <div className="d-flex align-items-center gutter-bottom-sm">
          <Button disabled={isBusy} block>
            Send
          </Button>
          <Button
            icon="paperclip"
            className="flex-grow-0 btn-attachment"
            title="Attach file"
            onClick={this.handleAttachClick}
            disabled={isBusy}
          />
        </div>
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

    const rx = new RegExp('^>([^\n]+)$', 'm'); // eslint-disable-line
    const quoteText = (text) => {
      const matches = text.match(rx);
      if (matches) {
        return text.replace(matches[0], `<blockquote class="hyphenate">${matches[1].trim()}</blockquote>`);
      }

      return text.replace(/\n/g, '<br />').autoLink({ target: '_blank', rel: 'nofollow' });
    };

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
                <Icon
                  name="quote-left"
                  className="editor-note-item-quote-icon"
                  title="Quote"
                  onClick={e => this.handleQuoteClick(e, note)}
                  fas
                />
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
                <div
                  className="editor-note-item-message hyphenate"
                  dangerouslySetInnerHTML={{ __html: quoteText(note.text) }}
                />
                {(note.attachmentUrl && video.isImageUrl(note.attachmentUrl)) && (
                  <a href={note.attachmentUrl} className="editor-note-item-attachment-image">
                    <img src={note.attachmentUrl}  alt="Attachment" />
                    <span>{note.attachmentName}</span>
                  </a>
                )}
                {(note.attachmentUrl && !video.isImageUrl(note.attachmentUrl)) && (
                  <a href={note.attachmentUrl} className="editor-note-item-attachment-file">
                    <Icon name="file" size={2} />
                    <span>{note.attachmentName}</span>
                  </a>
                )}
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
    const { isVisible, isBusy } = this.props;

    const classes = classNames('editor-notes', {
      'editor-notes-visible': isVisible
    });

    return (
      <div className={classes}>
        <div className="editor-notes-body">
          {this.renderNotes()}
          {this.renderForm()}
          {isBusy && (
            <Loading />
          )}
        </div>
      </div>
    );
  }
}
