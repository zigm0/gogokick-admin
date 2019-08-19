/**
 * @param {string} url
 * @returns {boolean|string}
 */
export function videoExtractYoutubeId(url) {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
  const match = url.match(regExp);

  return (match&&match[7].length === 11) ? match[7] : false;
}

export default {
  extractYoutubeId: videoExtractYoutubeId
}