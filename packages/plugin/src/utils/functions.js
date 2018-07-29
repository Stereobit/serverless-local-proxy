/**
 * FunctionsProxySettingsToFunctions
 *
 * TODO: @diego[refactor] this function is just terrible...
 * @param {Array} serviceFunctions
 * @param {Array} proxyFunctions
 * @return {*}
 */
const functionsProxySettingsToFunctions = (serviceFunctions, proxyFunctions) => {
  if (proxyFunctions instanceof Array && serviceFunctions instanceof Array) {
    const flatProxyFunctions = proxyFunctions.reduce((accumulator, currentValue) => {
      const [key] = Object.keys(currentValue)
      return accumulator.concat(Object.assign(currentValue[key] || {}, {name: key}))
    }, [])
    return serviceFunctions.map(functionDetail => {
      const match = flatProxyFunctions.find(proxyFunc => proxyFunc.name === functionDetail.name)
      if (match) { return Object.assign({}, match, functionDetail) }
      return functionDetail
    })
  }
  return []
}

/**
 * DynamodbProxySettingsToFunctions
 * TODO: @diego[refactor] this function is just terrible...
 * @param serviceFunctions
 * @param proxySettings
 */
const dynamodbProxySettingsToFunctions = (serviceFunctions, proxySettings) => {
  if (proxySettings instanceof Array && serviceFunctions instanceof Array) {
    const tableSettings = proxySettings.reduce((accumulator, currentValue) => {
      const [key] = Object.keys(currentValue)
      return accumulator.concat(Object.assign(currentValue[key] || {}, {name: key}))
    }, [])
    return serviceFunctions.map(functionDetail => {
      const match = tableSettings.find(tableSetting => tableSetting.trigger_function === functionDetail.name)
      if (match) {
        const newMatchRef = JSON.parse(JSON.stringify(match))
        delete newMatchRef.trigger_function
        delete newMatchRef.name
        return Object.assign({}, newMatchRef, functionDetail)
      }
      return functionDetail
    })
  }
  return serviceFunctions
}

module.exports = {functionsProxySettingsToFunctions, dynamodbProxySettingsToFunctions}
