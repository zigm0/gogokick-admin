import axios from 'axios';

/**
 * @param {string} url
 * @returns {Promise<any> | Promise | Promise}
 */
const get = (url) => {
  return axios.get(url)
    .then(resp => resp.data);
};

/**
 * @param {string} url
 * @param {*} body
 * @returns {Promise<any> | Promise | Promise}
 */
const post = (url, body = {}) => {
  return axios.post(url, body)
    .then(resp => resp.data);
};

/**
 * @param {string} method
 * @param {string} url
 * @param {*} data
 * @returns {Promise<any> | Promise | Promise}
 */
const req = (method, url, data = {}) => {
  return axios.request({
    url,
    data,
    method
  }).then(resp => resp.data);
};

export default {
  get,
  req,
  post
};
