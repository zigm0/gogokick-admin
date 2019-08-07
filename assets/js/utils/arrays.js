/**
 * Randomizes the given array
 *
 * @param {Array} array
 * @returns {Array}
 */
export function arrayShuffle(array) {
  const newArray = array.slice(0);
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }

  return newArray;
}

/**
 * @param {Array} array
 * @returns {*}
 */
export function arrayRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * @param {Array} items
 * @param {number} id
 * @returns {null|*}
 */
const arrayFindByID = (items, id) => {
  for (let i = 0, l = items.length; i < l; i++) {
    if (items[i].id === id) {
      return items[i];
    }
  }

  return null;
};

/**
 * @param {Array} items
 * @param {number} id
 * @returns {number}
 */
const arrayFindIndexByID = (items, id) => {
  for (let i = 0, l = items.length; i < l; i++) {
    if (items[i].id === id) {
      return i;
    }
  }

  return -1;
};

/**
 * @param {number} start
 * @param {number} size
 * @returns {number[]}
 */
const range = (start, size) => {
  return [...Array(size - start + 1).keys()].map(i => i + start);
};

export default {
  range,
  shuffle:       arrayShuffle,
  findByID:      arrayFindByID,
  randomItem:    arrayRandomItem,
  findIndexByID: arrayFindIndexByID
};
