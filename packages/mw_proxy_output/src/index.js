const MIDDLEWARE_NAME = 'proxy_output'

/**
 * Factory
 *
 * @param config
 * @return {Function}
 */
const factory = () => {
  return async (ctx, next) => {
    ctx.response.status = 200
    await next()
  }
}

module.exports = {factory, MIDDLEWARE_NAME}
