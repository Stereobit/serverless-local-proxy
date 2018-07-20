/**
 * Factory
 *
 * @return {{factoryType: string, resolver: (function(*, *): *)}}
 */
const factory = () => {
    return {
        factoryType: 'SERVER',
        resolver: async (ctx, next) => {
            return await next();
        }
    }
};
module.exports = { factory };
