import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ContentEditable from 'react-contenteditable';
import { connect, browser, objects, mapDispatchToProps } from 'utils';
import { Button } from 'components';
import { editorActions } from 'actions';
import BlockMenu from './BlockMenu';

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
    onChange:     PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);

    let { text } = props.block;
    this.content = React.createRef();
    this.state   = {
      text,
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

    browser.caretAtEnd(this.content.current);
    onChange(null, null);
  }

  /**
   *
   */
  componentWillUnmount() {
    const { block, editorChange } = this.props;
    const { text } = this.state;

    editorChange(objects.merge(block, { text }));
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
    const { block, editorChange, onChange } = this.props;

    if (cmd === 'headline') {
      editorChange(objects.merge(block, {
        isHeadline: !block.isHeadline
      }));
      onChange(e, value);
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
    const { block } = this.props;
    const { text, cmds } = this.state;

    const html = block.isHeadline ? `<h3>${text}</h3>` : text;
    const classes = classNames('block-editor block-editor-text block-expanded', {
      'block-editor-headline': block.isHeadline
    });

    const buttons = (
      <>
        <Button
          active={block.isHeadline}
          className="block-menu-item"
          onClick={e => this.handleMenuItemClick(e, 'headline')}
        >
          Headline
        </Button>
        <Button
          icon="list"
          active={cmds.insertUnorderedList}
          disabled={block.isHeadline}
          className="block-menu-item"
          onClick={e => this.handleMenuItemClick(e, 'insertUnorderedList')}
        />
        <Button
          icon="bold"
          active={cmds.bold}
          disabled={block.isHeadline}
          className="block-menu-item"
          onClick={e => this.handleMenuItemClick(e, 'bold')}
        />
        <Button
          icon="italic"
          active={cmds.italic}
          disabled={block.isHeadline}
          className="block-menu-item"
          onClick={e => this.handleMenuItemClick(e, 'italic')}
        />
        <Button
          icon="link"
          active={cmds.createLink}
          disabled={block.isHeadline}
          className="block-menu-item"
          onClick={e => this.handleMenuItemClick(e, cmds.createLink ? 'unlink' : 'createLink')}
        />
      </>
    );

    return (
      <>
        <BlockMenu block={block} buttons={buttons} />
        <div className={classes}>
          <ContentEditable
            html={html}
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
