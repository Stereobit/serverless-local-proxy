const PREFIX = 'FUNCTIONS_TO_HTTP'
const ACTIONS = {
  INVOKED_FUNCTION: `${PREFIX}_FUNCTION_INVOKED`,
  /**
   * INVOKED_FUNCTION_TRIGGER:
   *
   * @param {string} functionName
   * @param proxyName
   * @return {{type: string, functionName: *}}
   * @constructor
   */
  INVOKED_FUNCTION_TRIGGER: (functionName, proxyName) => {
    return {
      type: ACTIONS.INVOKED_FUNCTION,
      functionName,
      proxyName
    }
  }
}

module.exports = {ACTIONS}
