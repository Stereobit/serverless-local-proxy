const LOG_TAG = 'QueryLogger';
const prettyJson = require('prettyjson');
const { middlewareFormattedOutput } = require('../../../utils/middleware');
/**
 * Factory
 *
 * @return {{factoryType: string, resolver: resolver}}
 */
const factory = () => {

    return {
        factoryType: 'SERVER',
        resolver: async (ctx, next) => {
            const target = ctx.request.header['x-amz-target'].split('.');
            const method = ctx.request.method;
            // const target = ctx.request.header['x-amz-target'].splice('.');
            const log = prettyJson.render(ctx.request.body, {
                keysColor: 'cyan',
                dashColor: 'magenta',
                stringColor: 'magenta',
            });
            middlewareFormattedOutput(ctx, LOG_TAG, `NEW QUERY - method: ${method} target: ${target[1]}`, log);
            return await next();
        }
    }
};


module.exports = { factory };
