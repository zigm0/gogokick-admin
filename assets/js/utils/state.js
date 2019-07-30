import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

export { connect };

/**
 * @param {*} actions
 * @returns {function(*)}
 */
export function mapDispatchToProps(...actions) {
  const mapped = {};
  for (let i = 0; i < actions.length; i++) {
    const keys = Object.keys(actions[i]);
    for (let y = 0; y < keys.length; y++) {
      const key = keys[y];
      mapped[key] = actions[i][key];
    }
  }

  return (dispatch) => {
    return bindActionCreators(mapped, dispatch);
  };
}
