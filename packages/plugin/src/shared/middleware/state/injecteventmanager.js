const eventManager = require('../../../events/Manager');
const { fromJS } = require('immutable');

/**
 * Inject eventsManager in to the state
 *
 * @return {Function}
 */
const factory = () => {
    const manager = fromJS(eventManager);
    return async (ctx, next) => {
        ctx.state = ctx.state.merge({ eventsManager: manager});
        await next();
    }
};

module.exports = { factory };
