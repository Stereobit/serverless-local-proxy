const LOG_PREFIX = 'HttpRequestLogger::';
const chalk = require('chalk');

/**
 * Factory
 *
 */
const factory = () => {
    return {
        factoryType: 'SERVER',
        resolver: async (ctx, next) => {
            const request = ctx.request;
            const eventsManager = ctx.state.get('eventsManager');
            const loggerPrefix = ctx.state.get('proxyLoggerPrefix');
            const title = chalk.cyan('::: HTTP REQUEST LOGGER');
            const method = chalk.cyan(`METHOD: ${chalk.magenta(request.method)}`);
            const url = chalk.cyan(`URL: ${chalk.magenta(request.url)}`);
            const accept = chalk.cyan(`ACCEPT: ${chalk.magenta(request.header.accept)}`);
            eventsManager.emitLogInfo(formatLogMessage(loggerPrefix + LOG_PREFIX, title, method, url, accept));
            await next();
        }
    }
};

/**
 * FormatLogMessage
 *
 * @param {string} loggerPrefix
 * @param {string} title
 * @param {string} method
 * @param {string} url
 * @param {string} accept
 * @return {string}
 */
const formatLogMessage = (loggerPrefix, title, method, url, accept) => {
    return `${loggerPrefix}\n${title}
    ${method} - ${url} 
    ${accept}`;
};

module.exports = { factory };
