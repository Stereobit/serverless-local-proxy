/**
 * MapMiddlewareSettingsToFunctions
 *
 * @param {Array} serviceFunctions
 * @param {Array} proxyFunctions
 * @return {*}
 */
const mapMiddlewareSettingsToFunctions = (serviceFunctions, proxyFunctions) => {
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

module.exports = {mapMiddlewareSettingsToFunctions}
