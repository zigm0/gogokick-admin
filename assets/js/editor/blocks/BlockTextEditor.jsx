import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import autosize from 'autosize';
import ContentEditable from 'react-contenteditable';
import { connect, browser, objects, constants, campaigns, mapDispatchToProps } from 'utils';
import { Button, Icon } from 'components';
import { editorActions } from 'actions';
import BlockMenu from './BlockMenu';

const mapStateToProps = state => ({
  device:       state.ui.device,
  campaignType: state.project.campaignType
});

@connect(
  mapStateToProps,
  mapDispatchToProps(editorActions)
)
export default class BlockTextEditor extends React.PureComponent {
  static propTypes = {
    block: PropTypes.shape({
      text:       PropTypes.string,
      type:       PropTypes.number.isRequired,
      isHeadline: PropTypes.bool
    }).isRequired,
    device:            PropTypes.object.isRequired,
    campaignType:      PropTypes.number.isRequired,
    editorUpdateBlock: PropTypes.func.isRequired,
    onChange:          PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);

    let { text }  = props.block;
    this.content  = React.createRef();
    this.textarea = React.createRef();

    this.state   = {
      text,
      extraOpen:   false,
      htmlOpen:    false,
      extraStyles: {},
      format:      'p',
      cmds:        {
        insertUnorderedList: false,
        insertOrderedList:   false,
        createLink:          false,
        formatBlock:         false,
        indent:              false,
        outdent:             false,
        bold:                false,
        italic:              false,
        underline:           false,
        justifyLeft:         false,
        justifyCenter:       false,
        justifyRight:        false
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

    this.windowClickOff = browser.on('click', (e) => {
      if (!browser.hasParentClass(e.target, 'block-menu-dropdown')) {
        this.setState({ extraOpen: false });
      }
    });
  }

  /**
   *
   */
  componentWillUnmount() {
    const { block, editorUpdateBlock } = this.props;
    const { text } = this.state;

    editorUpdateBlock(objects.merge(block, { text }));
    this.windowClickOff();
  }

  /**
   * @param {*} prevProps
   * @param {*} prevState
   */
  componentDidUpdate(prevProps, prevState) {
    const { htmlOpen } = this.state;

    if (htmlOpen && !prevState.htmlOpen) {
      setTimeout(() => {
        autosize(this.textarea.current);
      }, 250);
    }
  }

  /**
   * @returns {string}
   */
  getHTML = () => {
    const { block, campaignType } = this.props;
    const { text } = this.state;

    let html = block.isHeadline ? `<h1>${text}</h1>` : text;
    if (html === '') {
      html = '<p><br /></p>';
    }

    return campaigns.stripHTML(campaignType, html);
  };

  /**
   * @param {Event} e
   */
  handleChange = (e) => {
    const { onChange } = this.props;
    let { value } = e.target;

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
    const { block, editorUpdateBlock, onChange } = this.props;

    e.preventDefault();

    if (cmd === 'headline') {
      editorUpdateBlock(objects.merge(block, {
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
    let { format } = this.state;
    const { cmds: oldCmds, format: oldFormat } = this.state;
    const cmds = objects.clone(oldCmds);

    Object.keys(cmds).forEach((key) => {
      cmds[key] = document.queryCommandState(key);
    });

    const node = browser.getSelectedNode();
    if (browser.hasParentTag(node, 'A')) {
      cmds.createLink = true;
    }

    if (browser.hasParentTag(node, 'H3')) {
      format = 'h3';
    } else if (browser.hasParentTag(node, 'H2')) {
      format = 'h2';
    } else {
      format = 'p';
    }

    if (!objects.isEqual(cmds, oldCmds) || format !== oldFormat) {
      this.setState({ cmds, format });
      // this.content.current.focus();
    }
  };

  /**
   * @param {Event} e
   */
  handleExtraButtonsClick = (e) => {
    const { extraOpen } = this.state;

    const rect = e.target.getBoundingClientRect();

    this.setState({
      extraOpen:   !extraOpen,
      extraStyles: {
        top:  rect.top + 27,
        left: rect.left
      }
    })
  };

  /**
   *
   */
  handleCodeClick = () => {
    const { htmlOpen } = this.state;

    this.setState({ htmlOpen: !htmlOpen });
  };

  /**
   * @returns {*}
   */
  renderButtons = () => {
    const { block, device, campaignType } = this.props;
    const { cmds, format, extraOpen, extraStyles, htmlOpen } = this.state;

    const campaignName = constants.campaignType(campaignType);

    let buttons = null;
    if (campaignName === 'indiegogo') {
      const extraButtons = (
        <>
          <Button
            icon="list"
            active={cmds.insertUnorderedList}
            className="block-menu-item"
            onMouseDown={e => this.handleMenuItemClick(e, 'insertUnorderedList')}
          />
          <Button
            icon="list-ol"
            active={cmds.insertOrderedList}
            className="block-menu-item"
            onMouseDown={e => this.handleMenuItemClick(e, 'insertOrderedList')}
          />
{/*          <Button
            icon="indent"
            active={cmds.indent}
            className="block-menu-item"
            onMouseDown={e => this.handleMenuItemClick(e, 'indent')}
          />
          <Button
            icon="outdent"
            active={cmds.outdent}
            className="block-menu-item"
            onMouseDown={e => this.handleMenuItemClick(e, 'outdent')}
          />*/}
          <div className="block-menu-item-separator" />
          <Button
            icon="align-left"
            active={cmds.justifyLeft}
            className="block-menu-item"
            onMouseDown={e => this.handleMenuItemClick(e, 'justifyLeft')}
          />
          <Button
            icon="align-center"
            active={cmds.justifyCenter}
            className="block-menu-item"
            onMouseDown={e => this.handleMenuItemClick(e, 'justifyCenter')}
          />
          <Button
            icon="align-right"
            active={cmds.justifyRight}
            className="block-menu-item"
            onMouseDown={e => this.handleMenuItemClick(e, 'justifyRight')}
          />
          <div className="block-menu-item-separator" />
          <Button
            icon="code"
            active={htmlOpen}
            className="block-menu-item"
            onClick={this.handleCodeClick}
          />
        </>
      );

      buttons = (
        <>
          <select
            className="block-menu-item"
            value={format}
            onChange={e => this.handleMenuItemClick(e, 'formatBlock', e.target.value)}
          >
            <option value="p">
              Paragraph
            </option>
            <option value="h2">
              Header 1
            </option>
            <option value="h3">
              Header 2
            </option>
          </select>
          <div className="block-menu-item-separator" />
          <Button
            icon="bold"
            active={cmds.bold}
            className="block-menu-item"
            onMouseDown={e => this.handleMenuItemClick(e, 'bold')}
          />
          <Button
            icon="italic"
            active={cmds.italic}
            className="block-menu-item"
            onMouseDown={e => this.handleMenuItemClick(e, 'italic')}
          />
          <Button
            icon="underline"
            active={cmds.underline}
            className="block-menu-item"
            onMouseDown={e => this.handleMenuItemClick(e, 'underline')}
          />
          <Button
            icon="link"
            active={cmds.createLink}
            className="block-menu-item"
            onMouseDown={e => this.handleMenuItemClick(e, cmds.createLink ? 'unlink' : 'createLink')}
          />
          <div className="block-menu-item-separator" />
          {!device.isDesktop ? (
            <>
              <Icon
                name="angle-down"
                className="block-menu-dropdown-btn"
                onClick={this.handleExtraButtonsClick}
              />
              {extraOpen && ReactDOM.createPortal(
                <div className="block-menu-dropdown" style={extraStyles}>
                  {extraButtons}
                </div>
                , document.body)
              }
            </>
          ) : (
            extraButtons
          )}
        </>
      );
    } else {
      buttons = (
        <>
          <Button
            active={block.isHeadline}
            className="block-menu-item"
            onMouseDown={e => this.handleMenuItemClick(e, 'headline')}
          >
            Headline
          </Button>
          <Button
            icon="list"
            active={cmds.insertUnorderedList}
            disabled={block.isHeadline}
            className="block-menu-item"
            onMouseDown={e => this.handleMenuItemClick(e, 'insertUnorderedList')}
          />
          <Button
            icon="bold"
            active={cmds.bold}
            disabled={block.isHeadline}
            className="block-menu-item"
            onMouseDown={e => this.handleMenuItemClick(e, 'bold')}
          />
          <Button
            icon="italic"
            active={cmds.italic}
            disabled={block.isHeadline}
            className="block-menu-item"
            onMouseDown={e => this.handleMenuItemClick(e, 'italic')}
          />
          <Button
            icon="link"
            active={cmds.createLink}
            disabled={block.isHeadline}
            className="block-menu-item"
            onMouseDown={e => this.handleMenuItemClick(e, cmds.createLink ? 'unlink' : 'createLink')}
          />
        </>
      );
    }

    return buttons;
  };

  /**
   * @returns {*}
   */
  render() {
    const { block } = this.props;
    const { htmlOpen, text } = this.state;

    const classes = classNames('block-editor block-editor-text block-expanded', {
      'block-editor-headline': block.isHeadline
    });

    return (
      <>
        <BlockMenu block={block} buttons={this.renderButtons()} />
        <div className={classes}>
          {htmlOpen ? (
            <textarea
              value={text}
              ref={this.textarea}
              onChange={this.handleChange}
              className="block-editor-text-editable block-text"
            />
          ) : (
            <ContentEditable
              html={this.getHTML()}
              innerRef={this.content}
              className="block-editor-text-editable block-text"
              onChange={this.handleChange}
              onClick={this.handleEditableClick}
            />
          )}
        </div>
      </>
    );
  }
}
