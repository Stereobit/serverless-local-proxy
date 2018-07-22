const LOG_PREFIX = 'Invoke::';
const HTTP_METHODS = { GET: 'get', POST: 'post' };
const { updateMiddlewareState, updateMiddlewareOutputState } = require('../../../utils/middleware');
/**
 * Factory
 *
 * @param config
 * @return {{factoryType: string, method: string, route: string, resolver: resolver}}
 */
const factory = (config) => {
        const { name: middlewareName } = config.middlewareConfig;
        return {
            middlewareName,
            factoryType: 'SERVER',
            resolver: async (ctx, next) => {
                console.log(middlewareName);
                await next();
            }
        }
    }
;

/**
 * RevolveHttpMethod
 *
 * @param globalConfig
 * @param functionConfig
 * @param defaultHttpMethod
 * @return {*}
 */
const resolveHttpMethod = (globalConfig, functionConfig, defaultHttpMethod = HTTP_METHODS.POST) => {
    if (functionConfig) {
        return functionConfig;
    }
    return (globalConfig) ? globalConfig : defaultHttpMethod;
};

/**
 * LogEndpointCreated
 *
 * @param config
 * @param httpMethod
 * @param functionName
 */
const logEndpointCreated = (config, httpMethod, functionName) => {
    const { proxy_host, proxy_port } = config.proxyConfig;
    const { eventsManager, proxyLogPrefix } = config;
    const { OUTPUT_LOG_INFO } = eventsManager.eventsList;
    eventsManager.emit(
        OUTPUT_LOG_INFO,
        `${proxyLogPrefix}${LOG_PREFIX} Created endpoint [${httpMethod}] ${proxy_host}:${proxy_port}/${functionName}`
    );
};

module.exports = { factory };
