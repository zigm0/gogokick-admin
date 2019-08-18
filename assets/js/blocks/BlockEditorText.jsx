import React from 'react';
import PropTypes from 'prop-types';
import ContentEditable from 'react-contenteditable';
import { connect, objects, mapDispatchToProps } from 'utils';
import { Button } from 'components';
import * as editorActions from 'actions/editorActions';

const mapStateToProps = state => ({

});

@connect(
  mapStateToProps,
  mapDispatchToProps(editorActions)
)
export default class BlockEditorText extends React.PureComponent {
  static propTypes = {
    block: PropTypes.shape({
      text: PropTypes.string,
      type: PropTypes.number.isRequired
    }).isRequired,
    editorChange: PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);

    let { text } = props.block;
    const isHeadline = text.indexOf('<h3>') === 0;

    this.content = React.createRef();
    this.state   = {
      text,
      isHeadline,
      cmds:       {
        list:   false,
        bold:   false,
        italic: false,
        link:   false
      }
    }
  }

  /**
   *
   */
  componentDidMount() {
    this.content.current.focus();
  }

  /**
   *
   */
  componentWillUnmount() {
    const { block, editorChange } = this.props;
    const { text } = this.state;

    editorChange({
      blockID: block.id,
      text
    });
  }

  /**
   * @param {Event} e
   */
  handleChange = (e) => {
    this.setState({ text: e.target.value });
  };

  /**
   * @param {Event} e
   * @param {string} cmd
   * @param {string} value
   */
  handleMenuItemClick = (e, cmd, value = '') => {
    if (cmd === 'headline') {
      const { isHeadline } = this.state;
      let { text } = this.state;

      if (!isHeadline) {
        text = `<h3>${text}</h3>`;
      } else {
        text = text.replace(/<\/?h3>/g, '');
      }
      this.setState({ text, isHeadline: !isHeadline });
    } else {
      document.execCommand(cmd, false, value);
      this.handleEditableClick();
    }
  };

  /**
   *
   */
  handleEditableClick = () => {
    const cmds = objects.clone(this.state.cmds);

    Object.keys(cmds).forEach((key) => {
      cmds[key] = document.queryCommandState(key);
    });

    this.setState({ cmds });
  };

  /**
   * @returns {*}
   */
  render() {
    const { text, isHeadline, cmds } = this.state;

    return (
      <>
        <div className="block-menu block-menu-text">
          <Button
            active={isHeadline}
            className="block-menu-item"
            onClick={e => this.handleMenuItemClick(e, 'headline')}
          >
            Headline
          </Button>
          <Button
            icon="list"
            active={cmds.list}
            disabled={isHeadline}
            className="block-menu-item"
            onClick={e => this.handleMenuItemClick(e, 'list')}
          />
          <Button
            icon="bold"
            active={cmds.bold}
            disabled={isHeadline}
            className="block-menu-item"
            onClick={e => this.handleMenuItemClick(e, 'bold')}
          />
          <Button
            icon="italic"
            active={cmds.italic}
            disabled={isHeadline}
            className="block-menu-item"
            onClick={e => this.handleMenuItemClick(e, 'italic')}
          />
          <Button
            icon="link"
            active={cmds.link}
            disabled={isHeadline}
            className="block-menu-item"
            onClick={e => this.handleMenuItemClick(e, 'link')}
          />
          <Button
            icon="times"
            active={cmds.link}
            className="block-menu-item block-menu-item-remove"
            onClick={this.handleRemoveClick}
          />
        </div>
        <div className="block-editor block-editor-text block-expanded">
          <ContentEditable
            html={text}
            innerRef={this.content}
            className="block-editor-text-editable block-text"
            onChange={this.handleChange}
            onClick={this.handleEditableClick}
          />
        </div>
      </>
    );
  }
}
