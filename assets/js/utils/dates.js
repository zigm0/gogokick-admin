const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * @param {number} timestamp
 * @returns {string}
 */
export function datesUnixToDateTime(timestamp) {
  const a     = new Date(timestamp * 1000);
  const year  = a.getFullYear();
  const month = months[a.getMonth()];
  const date  = a.getDate();
  const hour  = a.getHours();
  const min   = a.getMinutes();
  const sec   = a.getSeconds();

  return `${date} ${month} ${year} ${hour}:${min}:${sec}`;
}

/**
 * @param {number} timestamp
 * @returns {string}
 */
export function datesUnixToDate(timestamp) {
  const a     = new Date(timestamp * 1000);
  const year  = a.getFullYear();
  const month = months[a.getMonth()];
  const date  = a.getDate();

  return `${date} ${month} ${year}`;
}

/**
 * @param {number} timestamp
 * @returns {string}
 */
export function datesUnixToTime(timestamp) {
  const a     = new Date(timestamp * 1000);
  const hour  = a.getHours();
  const min   = a.getMinutes();
  const sec   = a.getSeconds();

  return `${hour}:${min}:${sec}`;
}

export default {
  unixToDate:     datesUnixToDate,
  unixToTime:     datesUnixToTime,
  unixToDateTime: datesUnixToDateTime
};
