/**
 * @param {string} url
 * @returns {boolean|string}
 */
export function videoExtractYoutubeId(url) {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
  const match = url.match(regExp);

  return (match && match[7].length === 11) ? match[7] : false;
}

/**
 * @param {string} url
 * @returns {string|boolean}
 */
export function videoYoutubeShortUrl(url) {
  const youtubeId = videoExtractYoutubeId(url);
  if (!youtubeId) {
    return false;
  }

  return `https://youtu.be/${youtubeId}`;
}

/**
 * @param {string} url
 * @returns {boolean}
 */
export function isImageUrl(url) {
  const ext = url.split('.').pop().toLowerCase();

  return ['jpg', 'jpeg', 'gif', 'png', 'webp'].indexOf(ext) !== -1;
}

export default {
  isImageUrl,
  extractYoutubeId: videoExtractYoutubeId,
  youtubeShortUrl:  videoYoutubeShortUrl
}
