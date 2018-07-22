const { fromJS } = require('immutable')
const chalk = require('chalk')

/**
 * GetMiddlewareState
 *
 * @param {{}} ctx
 * @param {string} middlewareName
 */
const getMiddlewareState = (ctx, middlewareName) => {
  const state = ctx.state.get(`${middlewareName}`)
  return (state) || createMiddlewareState(ctx, middlewareName)
}

/**
 * CreateMiddlewareState
 *
 * @param {{}} ctx
 * @param {string} middlewareName
 */
const createMiddlewareState = (ctx, middlewareName) => {
  ctx.state = ctx.state.set(middlewareName, fromJS({}))
  return getMiddlewareState(ctx, middlewareName)
}

/**
 * UpdateOutputState
 *
 * @param ctx
 * @param data
 */
const updateMiddlewareOutputState = (ctx, data) => {
  const output = ctx.state.get('output')
  const outputMerged = output.merge({ 'output': data })
  const valid = ctx.state.merge(outputMerged)
  ctx.state.set(valid)
}

/**
 * UpdateMiddlewareState
 *
 * @param {{}} ctx
 * @param {string} middlewareName
 * @param {*} data
 */
const updateMiddlewareState = (ctx, middlewareName, data) => {
  getMiddlewareState(ctx, middlewareName)
  ctx.state = ctx.state.merge({ [middlewareName]: fromJS(data) })
}

/**
 * MiddlewareFactoryGateway
 *
 * @param config
 * @return {Array}
 */
const middlewareFactoryGateway = (config) => {
  const { proxyConfig, middlewareList } = config
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
  return Object.assign({}, proxyConfig[nameWithSuffix], { name: nameWithSuffix })
}

/**
 * MiddlewareFormattedOutput
 *
 * @param {{}} ctx
 * @param {string} middlewareLogPrefix
 * @param {string} title
 * @param {string }message
 */
const middlewareFormattedOutput = (ctx = '', middlewareLogPrefix, title = '', message = '') => {
  const proxyPrefix = ctx.state.get('proxyLoggerPrefix')
  const eventsManager = ctx.state.get('eventsManager')
  const formattedTitle = chalk.cyan(`::: ${proxyPrefix.toUpperCase()}${middlewareLogPrefix.toUpperCase()}:: ${title.toUpperCase()}`)
  const formattedMessage = `    
${formattedTitle}
${message}

${chalk.dim.gray('________________________________________________________________________________________________________________________')}
`
  eventsManager.emitMiddlewareOutput(formattedMessage)
}

module.exports = {
  getMiddlewareState,
  createMiddlewareState,
  updateMiddlewareState,
  middlewareFormattedOutput,
  updateMiddlewareOutputState,
  middlewareFactoryGateway,
  extractMiddlewareConfig
}
