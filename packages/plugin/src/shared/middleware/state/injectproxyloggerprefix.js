/**
 * Inject proxy logger prefix
 *
 * @param proxyLoggerPrefix
 * @return {Function}
 */
const factory = (proxyLoggerPrefix) => {
    return async (ctx, next) => {
        ctx.state = ctx.state.set('proxyLoggerPrefix', proxyLoggerPrefix);
        await next()
    }
};

module.exports = { factory };
