import React from 'react';
import PropTypes from 'prop-types';
import { connect, mapDispatchToProps } from 'utils';

const mapStateToProps = state => ({

});

@connect(
  mapStateToProps,
  mapDispatchToProps()
)
export default class SoundCloudPlayer extends React.PureComponent {
  static propTypes = {
    userId:  PropTypes.number,
    trackId: PropTypes.number
  };

  static defaultProps = {};

  /**
   * @returns {*}
   */
  render() {
    const { userId, trackId } = this.props;

    let src;
    if (trackId) {
      src = `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${trackId}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`;
    } else if (userId) {
      src =`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/users/${userId}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`;
    } else {
      console.error('No userId or trackId provided.');
      return null;
    }

    return (
      <iframe
        width="100%"
        height="300"
        scrolling="no"
        frameBorder="no"
        allow="autoplay"
        src={src}
      />
    );
  }
}
