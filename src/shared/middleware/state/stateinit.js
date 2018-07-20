const { fromJS } = require('immutable');

/**
 * Init Proxy state
 *
 * @param defaultState
 * @return {Function}
 */
const factory = (defaultState = {}) => {
    return async (ctx, next) => {
        ctx.state = fromJS(defaultState);
        await next();
    }
};

module.exports = { factory };
