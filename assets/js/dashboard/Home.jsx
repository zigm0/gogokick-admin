import React from 'react';
import PropTypes from 'prop-types';
import { connect, mapDispatchToProps } from 'utils';
import { Button } from 'components';
import { uiActions } from 'actions';

const mapStateToProps = state => ({

});

@connect(
  mapStateToProps,
  mapDispatchToProps(uiActions)
)
export default class Home extends React.PureComponent {
  static propTypes = {
    uiWorkspace: PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   *
   */
  componentDidMount() {
    const { uiWorkspace } = this.props;

    uiWorkspace('home');
  }

  /**
   * @returns {*}
   */
  render() {
    return (
      <div className="home-page">
        <img src="/images/header-image.jpg" alt="Banner" />
        <img src="/images/header-sub.jpg" alt="Banner" />
      </div>
    );
  }
}
