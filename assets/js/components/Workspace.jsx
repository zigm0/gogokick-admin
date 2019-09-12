import React from 'react';
import PropTypes from 'prop-types';
import { connect, browser } from 'utils';
import { uiActions } from 'actions';

const mapDispatchToProps = dispatch => {
  return {
    uiWorkspace: (name) => dispatch(uiActions.uiWorkspace(name))
  }
};

@connect(
  null,
  mapDispatchToProps
)
export default class Workspace extends React.PureComponent {
  static propTypes = {
    name:        PropTypes.string.isRequired,
    title:       PropTypes.string,
    children:    PropTypes.node,
    uiWorkspace: PropTypes.func.isRequired
  };

  static defaultProps = {
    title:    '',
    children: ''
  };

  /**
   *
   */
  componentDidMount() {
    const { name, title, uiWorkspace } = this.props;

    uiWorkspace(name);
    if (title) {
      browser.title(title);
    }
  }

  /**
   * @returns {*}
   */
  render() {
    const { children } = this.props;

    return children;
  }
}
