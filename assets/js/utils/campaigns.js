import sanitizeHtml from 'sanitize-html';
import constants from './constants';

/**
 * @param {number} campaignType
 * @param {string} html
 */
const stripHTML = (campaignType, html) => {
  const campaignName = constants.campaignType(campaignType);

  if (campaignName === 'indiegogo') {
    html = sanitizeHtml(html, {
      allowedTags: ['h3', 'h4', 'h5', 'h6', 'small', 'blockquote', 'p', 'a', 'ul', 'ol',
        'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
        'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'iframe', 'img'],
      allowedAttributes: {
        a:   ['href'],
        img: ['src']
      },
      selfClosing:                       ['img', 'br', 'hr', 'area', 'base', 'basefont', 'input', 'link', 'meta'],
      allowedSchemes:                    ['http', 'https', 'ftp', 'mailto'],
      allowedSchemesByTag:               {},
      allowedSchemesAppliedToAttributes: ['href', 'src', 'cite'],
      allowProtocolRelative:             true
    });
  } else {
    html = sanitizeHtml(html, {
      allowedTags:       ['div', 'p', 'b', 'i', 'a', 'br', 'ul', 'li'],
      allowedAttributes: {}
    });
  }

  return html;
};

export default {
  stripHTML
}
