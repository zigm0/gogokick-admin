import React from 'react';
import PropTypes from 'prop-types';
import ContentEditable from 'react-contenteditable';
import { connect, browser, objects, mapDispatchToProps } from 'utils';
import { Button } from 'components';
import * as editorActions from 'actions/editorActions';

@connect(
  null,
  mapDispatchToProps(editorActions)
)
export default class BlockEditorText extends React.PureComponent {
  static propTypes = {
    block: PropTypes.shape({
      text: PropTypes.string,
      type: PropTypes.number.isRequired
    }).isRequired,
    editorChange: PropTypes.func.isRequired,
    onRemove:     PropTypes.func.isRequired,
    onChange:     PropTypes.func.isRequired
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
        insertUnorderedList: false,
        createLink:          false,
        bold:                false,
        italic:              false
      }
    }
  }

  /**
   *
   */
  componentDidMount() {
    const { onChange } = this.props;

    this.content.current.focus();
    onChange(null, null);
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
    const { onChange } = this.props;
    const { value } = e.target;

    this.setState({ text: value }, () => {
      onChange(e, value);
    });
  };

  /**
   * @param {Event} e
   * @param {string} cmd
   * @param {string} value
   */
  handleMenuItemClick = (e, cmd, value = '') => {
    if (cmd === 'headline') {
      const { isHeadline } = this.state;
      let { text }         = this.state;

      if (!isHeadline) {
        text = `<h3>${text}</h3>`;
      } else {
        text = text.replace(/<\/?h3>/g, '');
      }
      this.setState({ text, isHeadline: !isHeadline });
    } else if (cmd === 'createLink') {
      const url = prompt('Enter link URL');
      if (url) {
        document.execCommand(cmd, false, url);
      }
    } else {
      document.execCommand(cmd, false, value);
    }

    this.handleEditableClick();
  };

  /**
   *
   */
  handleEditableClick = () => {
    const cmds = objects.clone(this.state.cmds);

    Object.keys(cmds).forEach((key) => {
      cmds[key] = document.queryCommandState(key);
    });

    const node = browser.getSelectedNode();
    if (browser.hasParentTag(node, 'A')) {
      cmds.createLink = true;
    }

    this.setState({ cmds });
  };

  /**
   * @returns {*}
   */
  render() {
    const { block, onRemove } = this.props;
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
            active={cmds.insertUnorderedList}
            disabled={isHeadline}
            className="block-menu-item"
            onClick={e => this.handleMenuItemClick(e, 'insertUnorderedList')}
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
            active={cmds.createLink}
            disabled={isHeadline}
            className="block-menu-item"
            onClick={e => this.handleMenuItemClick(e, cmds.createLink ? 'unlink' : 'createLink')}
          />
          <Button
            icon="times"
            className="block-menu-item block-menu-item-remove"
            onClick={e => onRemove(e, block)}
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
