const ACTIONS = require('./actions')

const reducer = (state = {}, action) => {
  switch (action.type) {
    case ACTIONS.INVOKED_FUNCTION:
      return { ...state, functionName: action.functionName }
    default:
      return state
  }
}

module.exports = { reducer }
