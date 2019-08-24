import React from 'react';
import PropTypes from 'prop-types';
import { connect, history, api, router, mapDispatchToProps } from 'utils';

const mapStateToProps = state => ({
  isAuthenticated: state.user.isAuthenticated
});

@connect(
  mapStateToProps,
  mapDispatchToProps()
)
export default class Invite extends React.PureComponent {
  static propTypes = {
    match:           PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool.isRequired
  };

  static defaultProps = {};

  /**
   *
   */
  componentDidMount() {
    const { match, isAuthenticated } = this.props;
    const { id, hash } = match.params;

    if (!isAuthenticated) {
      history.push(`/login?back=${match.url}`);
    } else {
      api.post(router.generate('api_team_accept_invite', { id, hash }))
        .then((resp) => {
          history.push(resp);
        });
    }
  }

  /**
   * @returns {*}
   */
  render() {
    return null;
  }
}
