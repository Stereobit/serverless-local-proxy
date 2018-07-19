/**
 * MiddlewareFactoryGateway
 *
 * @param config
 * @return {Array}
 */
const middlewareFactoryGateway = (config) => {
    const { proxyConfig, middlewareList } = config;
    const factoriesArray = [];
    proxyConfig.middleware.forEach(proxyConfigMiddleware => {
        const middleware = middlewareList.find(availableMiddleware => availableMiddleware.name === proxyConfigMiddleware);
        if (middleware)
            factoriesArray.push(middleware);
    });
    const middlewareArray = [];
    factoriesArray.forEach(middleware => {
        const factoryResult = middleware.factory({
            middlewareConfig: extractMiddlewareConfig(proxyConfig, middleware.name),
            ...config
        });
        if (factoryResult instanceof Array) {
            factoryResult.forEach(factoryElement => middlewareArray.push(factoryElement))
        } else {
            middlewareArray.push(factoryResult);
        }
    });
    return middlewareArray;
};

/**
 * Extract middleware global settings
 *
 * @param proxyConfig
 * @param middlewareName
 * @return {*}
 */
const extractMiddlewareConfig = (proxyConfig, middlewareName) => {
    const nameWithSuffix = `${middlewareName}_middleware`;
    return Object.assign({}, proxyConfig[nameWithSuffix], { name: nameWithSuffix });
};

module.exports = { middlewareFactoryGateway };

