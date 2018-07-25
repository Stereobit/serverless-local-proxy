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
    case ACTIONS.LIST_SERVICE_FUNCTIONS:
      return {...state, functionsSettings: action.functionsList}
    default:
      return state
  }
}

module.exports = {reducer}
