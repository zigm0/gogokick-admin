import React from 'react';
import PropTypes from 'prop-types';
import { api, router, browser, mapDispatchToProps } from 'utils';
import { Container } from 'components/bootstrap';
import { LoadingCubes } from 'components';
import { connect } from "react-redux";
import { uiActions } from 'actions';

const mapStateToProps = state => ({
  projects: state.editor.projects
});

@connect(
  mapStateToProps,
  mapDispatchToProps(uiActions)
)
export default class Component extends React.PureComponent {
  static propTypes = {
    name:        PropTypes.string.isRequired,
    uiWorkspace: PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);

    this.state = {
      content: null,
      error:   null
    };
  }

  /**
   *
   */
  componentDidMount() {
    const { name, uiWorkspace } = this.props;

    uiWorkspace('content');

    api.get(router.generate('api_content_index', { name }))
      .then((resp) => {
        if (resp._error) {
          this.setState({ error: resp._error });
        } else {
          browser.title(resp.title);
          this.setState({ content: resp });
        }
      });
  }

  /**
   * @returns {*}
   */
  render() {
    const { content, error } = this.state;

    if (!content && !error) {
      return <LoadingCubes />;
    }

    if (error) {
      return (
        <div>
          {error}
        </div>
      );
    }

    return (
      <Container className="gutter-top">
        <h1>{content.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: content.html }} />
      </Container>
    );
  }
}
