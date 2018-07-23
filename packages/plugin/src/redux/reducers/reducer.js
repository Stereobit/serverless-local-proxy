const {ACTIONS} = require('../actions/actions')

/**
 * Reducer
 *
 * @param state
 * @param action
 * @return {{functionName: *}}
 */
const reducer = (state = {}, action) => {
  switch (action.type) {
    case ACTIONS.LIST_FUNCTIONS:
      return {...state, functionName: action.functionName, proxyName: action.proxyName}
    default:
      return state
  }
}

module.exports = {reducer}
