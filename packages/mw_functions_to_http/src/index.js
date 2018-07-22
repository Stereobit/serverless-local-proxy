const LOG_PREFIX = 'Http::';
const HTTP_METHODS = { GET: 'get', POST: 'post' };
/**
 * Factory
 *
 * @param config
 * @return {{factoryType: string, method: string, route: string, resolver: resolver}}
 */
const factory = (config) => {
    // Extract global middleware config
    const { name: middlewareName, default_http_method } = config.middlewareConfig;
    return config.serviceFunctions.map(functionDetails => {
        // Extract middleware config from function
        const { method: methodFromFunction } = functionDetails[middlewareName] || {};
        const method = resolveHttpMethod(default_http_method, methodFromFunction);
        logEndpointCreated(config, method, functionDetails.name);
        return {
            middlewareName,
            factoryType: 'ROUTER',
            method: method.toLowerCase(),
            route: `/${functionDetails.name}`,
            resolver: async (ctx, next) => {
                const state = {
                    functionName: functionDetails.name,
                    functionPath: functionDetails.path,
                    receiveEventType: (functionDetails.hasOwnProperty('awsEvents_middleware')
                            ? functionDetails.awsEvents_middleware
                            : null
                    )
                };
                const dispatch = ctx.state.get('store').get('dispatch');
                dispatch({ type: 'SUPERPOWER' });
                await next();
            }
        }
    });
};

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
