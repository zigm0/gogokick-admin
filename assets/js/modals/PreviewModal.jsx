import React from 'react';
import PropTypes from 'prop-types';
import Clipboard from 'clipboard';
import { connect, api, router, mapDispatchToProps } from 'utils';
import { RadioGroup } from 'components/forms';
import { Button } from 'components/bootstrap';
import { Modal } from 'components';
import { formActions } from 'actions';

const mapStateToProps = state => ({
  forms:   state.forms,
  editor:  state.editor,
  project: state.project,
  modals:  state.ui.modals
});

@connect(
  mapStateToProps,
  mapDispatchToProps(formActions)
)
export default class PreviewModal extends React.PureComponent {
  static propTypes = {
    forms:       PropTypes.object.isRequired,
    editor:      PropTypes.object.isRequired,
    project:     PropTypes.object.isRequired,
    modals:      PropTypes.object.isRequired,
    formChanges: PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);

    this.state = {
      url:     '',
      hash:    '',
      expires: '1 month'
    };
  }

  /**
   *
   */
  componentDidMount() {
    this.clipboard = new Clipboard('#preview-copy-btn');
  }

  /**
   * @param {*} prevProps
   */
  componentDidUpdate(prevProps) {
    const { modals } = this.props;
    const { modals: prevModals } = prevProps;

    if (modals.preview && !prevModals.preview) {
      this.handleUpdate();
    }
  }

  /**
   *
   */
  handleUpdate = () => {
    const { project } = this.props;

    api.post(router.generate('api_previews_save_project', { id: project.id }))
      .then((resp) => {
        this.setState({
          url:     resp.url,
          hash:    resp.hash,
          expires: '1 month'
        });
      });
  };

  /**
   *
   */
  handleWindowClick = () => {
    const { url } = this.state;

    window.open(url);
  };

  /**
   * @param {Event} e
   * @param {string} value
   */
  handleExpiresChange = (e, value) => {
    const { project } = this.props;
    const { hash, expires } = this.state;

    if (expires !== value) {
      this.setState({ expires: value });
      api.post(
        router.generate('api_previews_update_project', { id: project.id, hash }),
        { expires: value }
      );
    }
  };

  /**
   * @returns {*}
   */
  renderForm = () => {
    const { url, expires } = this.state;

    return (
      <form>
        <div className="form-group">
          <input
            className="form-control"
            id="preview-url-input"
            value={url}
            readOnly
          />
        </div>
        <div className="form-group btn-spaced-group">
          <button
            id="preview-copy-btn"
            data-clipboard-target="#preview-url-input"
            type="button"
            className="btn btn-sm btn-secondary"
          >
            Copy to clipboard
          </button>
          <Button type="button" theme="secondary" onClick={this.handleWindowClick} sm>
            Open in new window
          </Button>
        </div>
        <RadioGroup
          id="preview-expires-input"
          label="Expires"
          value={expires}
          values={[
            { label: '1 month', value: '1 month' },
            { label: '1 week', value: '1 week' },
            { label: '1 day', value: '1 day' },
            { label: '1 hour', value: '1 hour' }
          ]}
          onChange={this.handleExpiresChange}
          inline
        />
      </form>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    return (
      <Modal
        name="preview"
        title="Preview"
      >
        <p>
          Share this link...
        </p>
        {this.renderForm()}
      </Modal>
    );
  }
}
