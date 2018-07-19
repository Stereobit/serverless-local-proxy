const { fromJS } = require('immutable');

/**
 * Init Proxy state
 *
 * @param defaultState
 * @return {Function}
 */
const factory = (defaultState = {}) => {
    const state = fromJS(defaultState);
    return async (ctx, next) => {
        ctx.state = state;
        await next()
    }
};

module.exports = { factory };
