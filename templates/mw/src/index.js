const MIDDLEWARE_NAME = 'your_middleware_name';
const LOG_PREFIX = 'YOUR_MIDDLEWARE_LOG_PREFIX::';

/**
 * Factory
 *
 * @param config
 * @return {{middlewareName: *, factoryType: string, resolver: resolver}}
 */
const factory = (config) => {
    const { name: middlewareName } = config.middlewareConfig;
    return {
        middlewareName,
        factoryType: 'SERVER',
        resolver: async (ctx, next) => {

            await next();
        }
    }
};


module.exports = { factory, MIDDLEWARE_NAME };
