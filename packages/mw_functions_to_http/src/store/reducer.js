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
    case ACTIONS.INVOKED_ENDPOINT:
      return {
        ...state,
        functionName: action.functionName,
        requestPayload: action.requestPayload,
        proxyName: action.proxyName
      }
    default:
      return state
  }
}

module.exports = {reducer}
