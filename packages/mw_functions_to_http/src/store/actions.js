const PREFIX = 'FUNCTIONS_TO_HTTP_'
const ACTIONS = {
  INVOKED_FUNCTION: `${PREFIX}_INVOKED_FUNCTION`,
  INVOKED_FUNCTION_TRIGGER: (functionName) => {
    return {
      type: ACTIONS.INVOKED_FUNCTION,
      functionName: functionName
    }
  }
}

module.exports = { ACTIONS }
