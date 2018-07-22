const { fromJS } = require('immutable');
const { store } = require('../../../redux/index');
/**
 * Inject store
 *
 * @return {Function}
 */
const factory = (functionsList) => {
    return async (ctx, next) => {
        console.log(functionsList);
        await next();
    }
};

module.exports = { factory };