import React from 'react';
import PropTypes from 'prop-types';
import ContentEditable from 'react-contenteditable';
import { connect, mapDispatchToProps } from 'utils';
import { Icon } from 'components';
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
    this.textarea = React.createRef();
    this.state = {
      text: props.block.text
    }
  }


  componentDidMount() {
    this.textarea.current.focus();
  }

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
   * @returns {*}
   */
  render() {
    const { text } = this.state;

    return (
      <div className="block-editor block-editor-text">
        <div className="block-menu">
          <Icon
            name="edit"
            title="Edit"
            className="block-menu-item"
            onClick={this.handleEditClick}
          />
          <Icon
            name="trash"
            title="Remove"
            className="block-menu-item block-menu-item-remove"
            onClick={this.handleRemoveClick}
          />
        </div>
        <textarea
          ref={this.textarea}
          value={text}
          className="block-editor-text-textarea"
          onChange={this.handleChange}
        />
      </div>
    );
  }
}
