import styles from '../../css/_vars.scss';
import constants from 'utils/constants';

export const breakpoints = {
  xs: parseInt(styles.breakXs, 10),
  sm: parseInt(styles.breakSm, 10),
  md: parseInt(styles.breakMd, 10),
  lg: parseInt(styles.breakLg, 10),
  xl: parseInt(styles.breakXl, 10)
};

export const deviceHeights = {
  xs: 480,
  sm: 960,
  md: 540,
  lg: 720,
  xl: 1200
};

export const widths = {
  blocks: {
    [constants.campaignType('kickstarter')]: parseInt(styles.widthBlockKickstarter, 10)
  }
};

export const heights = {
  blocks: {
    [constants.campaignType('kickstarter')]: {
      [constants.blockType('text')]:  parseInt(styles.heightBlockTextKickstarter, 10),
      [constants.blockType('image')]: parseInt(styles.heightBlockImageKickstarter, 10),
      [constants.blockType('video')]: parseInt(styles.heightBlockVideoKickstarter, 10),
      [constants.blockType('audio')]: parseInt(styles.heightBlockAudioKickstarter, 10)
    }
  }
};

export default {
  breakpoints,
  deviceHeights,
  widths,
  heights
}
