const eventManager = require('../../../events/Manager');

/**
 * Inject eventsManager in to the state
 *
 * @return {Function}
 */
const factory = () => {
    const { fromJS } = require('immutable');
    const manager = fromJS(eventManager);
    return async (ctx, next) => {
        ctx.state = ctx.state.set('eventsManager', manager);
        await next()
    }
};

module.exports = { factory };
