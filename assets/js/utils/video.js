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
 * @returns {boolean|string}
 */
export function videoExtractSoundCloudTrackId(url) {
  const regExp = /soundcloud\.com\/tracks\/([\d]+)/;
  const match  = url.match(regExp);

  return (match && match[1]) ? match[1] : false;
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

export default {
  extractYoutubeId:         videoExtractYoutubeId,
  extractSoundCloudTrackId: videoExtractSoundCloudTrackId,
  youtubeShortUrl:          videoYoutubeShortUrl
}
