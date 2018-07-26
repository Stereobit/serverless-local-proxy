const {fromJS} = require('immutable')
const chalk = require('chalk')
const watch = require('redux-watch')

/**
 * LogInfo
 *
 * @param ctx
 * @param middlewarePrefix
 * @param message
 */
const logInfo = (ctx, middlewarePrefix, message) => {
  const proxyPrefix = ctx.state.get('proxyLoggerPrefix')
  const eventsManager = ctx.state.get('eventsManager')
  eventsManager.emitLogInfo(`${proxyPrefix}:${middlewarePrefix}:: ${message}`)
}

/**
 * GetEventsManager
 *
 * @param {{}} ctx
 */
const getEventsManager = (ctx) => {
  return ctx.state.get('eventsManager')
}

/**
 * SubscribeToStoreChanges
 *
 * @param {{state:{}}} ctx
 * @param {string} storePath
 * @param {Function} resolver
 */
const subscribeToStoreChanges = (ctx, storePath, resolver) => {
  const reduxSubscribe = getReduxSubscribeFunction(ctx)
  const reduxGetState = getReduxGetStateFunction(ctx)
  let w = watch(reduxGetState, storePath)
  reduxSubscribe(w((newVal, oldVal, objectPath) => resolver(newVal, oldVal, objectPath)))
}

/**
 * GetReduxStore
 *
 * @param ctx
 */
const getReduxStore = (ctx) => {
  return ctx.state.get('store')
}

/**
 * GetReduxState
 *
 * @param {{stage:{}}} ctx
 */
const getReduxState = (ctx) => {
  return ctx.state.get('store').get('getState')()
}

/**
 * GetReduxGetStateFunction
 *
 * @param ctx
 */
const getReduxGetStateFunction = (ctx) => {
  return ctx.state.get('store').get('getState')
}

/**
 * GetReduxDispatchFunction
 *
 * @param ctx
 */
const getReduxDispatchFunction = (ctx) => {
  return ctx.state.get('store').get('dispatch')
}

/**
 * GetReduxSubscribeFunction
 *
 * @param ctx
 */
const getReduxSubscribeFunction = (ctx) => {
  return ctx.state.get('store').get('subscribe')
}

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
  let output = ctx.state.get('output')
  if (!output) {
    output = fromJS({output: {}})
  }
  const outputMerged = output.merge({output: data})
  ctx.state = ctx.state.mergeDeep(outputMerged)
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
  ctx.state = ctx.state.merge({[middlewareName]: fromJS(data)})
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
  getReduxStore,
  getReduxState,
  getReduxGetStateFunction,
  getReduxSubscribeFunction,
  getMiddlewareState,
  createMiddlewareState,
  updateMiddlewareState,
  middlewareFormattedOutput,
  updateMiddlewareOutputState,
  middlewareFactoryGateway,
  extractMiddlewareConfig,
  subscribeToStoreChanges,
  getReduxDispatchFunction,
  getEventsManager,
  logInfo,
}
