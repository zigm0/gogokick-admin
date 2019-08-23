import React from 'react';
import PropTypes from 'prop-types';
import { connect, mapDispatchToProps } from 'utils';
import { Button } from 'components';

const mapStateToProps = state => ({

});

@connect(
  mapStateToProps,
  mapDispatchToProps()
)
export default class Home extends React.PureComponent {
  static propTypes = {};

  static defaultProps = {};

  /**
   * @returns {*}
   */
  render() {
    return (
      <div className="gutter-top">
        <div className="row">
          <div className="col col-xl-4 offset-xl-4 text-center gutter-lg">
            <Button theme="primary" to="/dashboard">
              Dashboard
            </Button>
          </div>
        </div>
        <div className="row">
          <div className="col col-xl-4 offset-xl-4 text-center gutter-lg">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/C9Q98Ct2FCE"
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    );
  }
}
