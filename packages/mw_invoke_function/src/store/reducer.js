const {ACTIONS} = require('./actions')

/**
 * Reducer
 *
 * @param state
 * @param action
 * @return {{functionName: *}}
 */
const reducer = (state = {}, action) => {
  switch (action.type) {
    case ACTIONS.INVOKED_FUNCTION:
      return {...state, functionName: action.functionName, proxyName: action.proxyName}
    default:
      return state
  }
}

module.exports = {reducer}
