const chalk = require('chalk')
const EventsManager = require('@serverless-local-proxy/events_manager')

/**
 * LogInfo
 *
 * @param {string} proxyLogPrefix
 * @param {string} middlewareLogPrefix
 * @param {string} message
 */
const logInfo = (proxyLogPrefix, middlewareLogPrefix, message) => {
  EventsManager.emitLogInfo(`${proxyLogPrefix}:${middlewareLogPrefix}:: ${message}`)
}

/**
 * GetMiddlewareOutputState
 *
 * @param {{}} ctx
 */
const getMiddlewareOutputState = (ctx) => {
  return ctx.state.get('output').toJS()
}

/**
 * UpdateMiddlewareOutputState
 *
 * @param {*} ctx
 * @param {*} data
 */
const updateMiddlewareOutputState = (ctx, data) => {
  const output = ctx.state.get('output')
  const {state} = ctx
  ctx.state = state.set('output', output.merge(data))
}

/**
 * MiddlewareFactoryGateway
 *
 * @param config
 * @return {Array}
 */
const middlewareFactoryGateway = (config) => {
  const {proxyConfig, middlewareList} = config
  const factoriesArray = []
  proxyConfig.middleware.forEach(proxyConfigMiddleware => {
    const middleware = middlewareList.find(availableMiddleware => availableMiddleware.name === proxyConfigMiddleware)
    if (middleware) { factoriesArray.push(middleware) }
  })
  const middlewareArray = []
  factoriesArray.forEach(middleware => {
    const factoryResult = middleware.factory({
      middlewareConfig: extractMiddlewareConfig(proxyConfig, middleware.name),
      ...config
    })
    if (factoryResult instanceof Array) {
      factoryResult.forEach(factoryElement => middlewareArray.push(factoryElement))
    } else {
      middlewareArray.push(factoryResult)
    }
  })
  return middlewareArray
}

/**
 * Extract middleware global settings
 *
 * @param proxyConfig
 * @param middlewareName
 * @return {*}
 */
const extractMiddlewareConfig = (proxyConfig, middlewareName) => {
  const nameWithSuffix = `${middlewareName}_middleware`
  return Object.assign({}, proxyConfig[nameWithSuffix], {name: nameWithSuffix})
}

/**
 * MiddlewareFormattedOutput
 *
 * @param {string} proxyLogPrefix
 * @param {string} middlewareLogPrefix
 * @param {string} title
 * @param {string }message
 */
const middlewareFormattedOutput = (proxyLogPrefix, middlewareLogPrefix, title = '', message = '') => {
  const formattedTitle = chalk.cyan(`::: ${proxyLogPrefix.toUpperCase()}${middlewareLogPrefix.toUpperCase()}:: ${title.toUpperCase()}`)
  const formattedMessage = `    
${formattedTitle}
${message}

${chalk.dim.gray('________________________________________________________________________________________________________________________')}
`
  EventsManager.emitMiddlewareOutput(formattedMessage)
}

module.exports = {
  middlewareFormattedOutput,
  updateMiddlewareOutputState,
  middlewareFactoryGateway,
  extractMiddlewareConfig,
  logInfo,
  getMiddlewareOutputState
}
