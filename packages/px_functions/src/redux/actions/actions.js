const PREFIX = 'FUNCTIONS_PROXY_ACTION'
const ACTIONS = {
  LIST_SERVICE_FUNCTIONS: `${PREFIX}_LIST_SERVICE_FUNCTIONS`,
  /**
   * LIST_SERVICE_FUNCTIONS_TRIGGER
   *
   * @param functionsList
   * @return {{type: string, functionsList: *}}
   * @constructor
   */
  LIST_SERVICE_FUNCTIONS_TRIGGER: (functionsList) => {
    return {
      type: ACTIONS.LIST_SERVICE_FUNCTIONS,
      functionsList
    }
  }
}

module.exports = {ACTIONS}
