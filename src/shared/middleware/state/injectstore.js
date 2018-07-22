const { fromJS } = require('immutable');
const { store } = require('../../../redux');
/**
 * Inject store
 *
 * @return {Function}
 */
const factory = () => {
    return async (ctx, next) => {
        ctx.state = fromJS({ store });
        await next();
    }
};

module.exports = { factory };
