/**
 * @param {string} method
 * @param {*} body
 * @returns {{headers: {"Content-Type": string}, method: string}}
 */
const headers = (method, body = {}) => {
  if (method === 'GET') {
    return {
      headers: {
        'Content-Type': 'application/json'
      },
      method
    };
  } else {
    return {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
      method
    };
  }
};

/**
 * @param {string} url
 * @returns {Promise<any> | Promise | Promise}
 */
const get = (url) => {
  return new Promise((resolve, reject) => {
    fetch(url, headers('GET'))
      .then((resp) => {
        if (!resp.ok) {
          throw new Error(resp.statusText);
        }
        return resp.json();
      })
      .then(resolve)
      .catch(reject);
  });
};

/**
 * @param {string} url
 * @param {*} body
 * @returns {Promise<any> | Promise | Promise}
 */
const post = (url, body = {}) => {
  return new Promise((resolve, reject) => {
    fetch(url, headers('POST', body))
      .then((resp) => {
        if (!resp.ok) {
          throw new Error(resp.statusText);
        }
        return resp.json();
      })
      .then(resolve)
      .catch(reject);
  });
};

export default {
  get,
  post
};
