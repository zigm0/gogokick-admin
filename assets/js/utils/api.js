/**
 * @param {number} eid
 * @returns {Promise<any> | Promise | Promise}
 */
const fetchEmail = (eid) => {
  return new Promise((resolve, reject) => {
    fetch(`/api/templates/emails/${eid}`, {
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
  fetchEmail
};
