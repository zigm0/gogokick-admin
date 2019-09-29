import constants from './constants';
import strings from './strings';

/**
 * @param {number} campaignType
 * @param {string} html
 */
const stripHTML = (campaignType, html) => {
  const campaignName = constants.campaignType(campaignType);

  if (campaignName === 'indiegogo') {
    html = strings.stripTags(html, '<div><p><b><i><a><u><br><ul><ol><li><h1><h2>');
  } else {
    html = strings.stripTags(html, '<div><p><b><i><a><br><ul><li>');
  }

  return html;
};

export default {
  stripHTML
}
