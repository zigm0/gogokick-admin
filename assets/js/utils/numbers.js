/**
 * Adds commas to a number
 *
 * @param {number} number
 * @returns {string}
 */
export function numberAddCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Returns a random number between min and max
 *
 * @param {number} min
 * @param {number} max
 */
export function numberRandom(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * @param {number|string} number
 * @param {number}radix
 * @returns {number}
 */
export function numberClean(number, radix = 10) {
  return parseInt(number.toString().replace(/[^\d.]/g, ''), radix);
}

/**
 * @param {number} number
 * @returns {string}
 */
export function numberMoney(number) {
  return `$${numberAddCommas(Math.round(number))}`;
}

/**
 * @param {number} number
 * @returns {string}
 */
export function numberPercent(number) {
  return `${numberAddCommas(number)}%`;
}

export default {
  addCommas: numberAddCommas,
  random:    numberRandom,
  clean:     numberClean,
  money:     numberMoney,
  percent:   numberPercent
};
