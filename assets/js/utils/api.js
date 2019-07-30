/**
 * @param {number} id
 * @returns {Promise<any> | Promise | Promise}
 */
const fetchBlocks = (id) => {
  return new Promise((resolve, reject) => {
    fetch(`/api/blocks/${id}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'GET'
    })
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
  fetchBlocks
};
