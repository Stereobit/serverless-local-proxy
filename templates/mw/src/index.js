const MIDDLEWARE_NAME = 'your_middleware_name'

/**
 * Factory
 *
 * @param config
 * @return {Function}
 */
const factory = (config) => {
  return async (ctx, next) => {
    await next()
  }
}

module.exports = {factory, MIDDLEWARE_NAME}
