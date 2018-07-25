const PREFIX = 'FUNCTIONS_TO_HTTP_MIDDLEWARE'
const ACTIONS = {
  INVOKED_ENDPOINT: `${PREFIX}_ENDPOINT_INVOKED`,
  /**
   * INVOKED_FUNCTION_TRIGGER:
   *
   * @param {string} functionName
   * @param {{any}} requestPayload
   * @param proxyName
   * @return {{type: string, functionName: *}}
   * @constructor
   */
  INVOKED_FUNCTION_TRIGGER: (functionName, requestPayload, proxyName) => {
    return {
      type: ACTIONS.INVOKED_ENDPOINT,
      requestPayload,
      functionName,
      proxyName
    }
  }
}

module.exports = {ACTIONS}
