const MIDDLEWARE_NAME = 'invoke_http_function'
const axios = require('axios')

/**
 * Factory
 * TODO: @diego[feature] this middleware is not completed yet
 * @param config
 * @return {Function}
 */
const factory = (config) => {
  const {name: middlewareName} = config.middlewareConfig
  return async (ctx, next) => {
    const input = ctx.state.get('output').toJS()
    try {
      await axios.post(`http://localhost:9002/${input.functionName}`, input.payload)
    } catch (e) {
      console.log(e)
    }
    await next()
  }
}

module.exports = {factory, MIDDLEWARE_NAME}
