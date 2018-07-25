const MIDDLEWARE_NAME = 'state_inject'
const {fromJS} = require('immutable')

/**
 * Inject store
 *
 * @return {Function}
 */
const factory = (key, value) => {
  return async (ctx, next) => {
    if (Object.values(ctx.state) <= 0) {
      ctx.state = fromJS({})
    }
    const {state} = ctx
    ctx.state = state.set(key, fromJS(value))
    await next(ctx)
  }
}

module.exports = {factory, MIDDLEWARE_NAME}
