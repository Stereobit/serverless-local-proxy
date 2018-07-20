const { fromJS } = require('immutable');
const chalk = require('chalk');

/**
 * GetMiddlewareState
 *
 * @param {{}} ctx
 * @param {string} middlewareName
 */
const getMiddlewareState = (ctx, middlewareName) => {
    const state = ctx.state.get(middlewareName);
    return (state) ? state : createMiddlewareState(ctx, middlewareName);
};

/**
 * CreateMiddlewareState
 *
 * @param {{}} ctx
 * @param {string} middlewareName
 */
const createMiddlewareState = (ctx, middlewareName) => {
    const newStage = { [middlewareName]: {} };
    ctx.state = ctx.state.merge(fromJS(newStage));
    return ctx.state;
};

/**
 * UpdateMiddlewareState
 *
 * @param {{}} ctx
 * @param {string} middlewareName
 * @param {{*}} data
 */
const updateMiddlewareState = (ctx, middlewareName, data) => {
    const newStage = { [middlewareName]: data };
    ctx.state = ctx.state.merge(fromJS(newStage));
    return ctx.state;
};

/**
 * MiddlewareFormattedOutput
 *
 * @param {{}} ctx
 * @param {string} middlewareLogPrefix
 * @param {string} }title
 * @param {string }message
 */
const middlewareFormattedOutput = (ctx, middlewareLogPrefix, title, message) => {
    const proxyPrefix = ctx.state.get('proxyLoggerPrefix');
    const eventsManager = ctx.state.get('eventsManager');
    const formattedTitle = chalk.cyan(`::: ${title}`);
    const formattedMessage = `${proxyPrefix}${middlewareLogPrefix}'\n${formattedTitle}\n
${message}
`;
    eventsManager.emitLogInfo(formattedMessage)
};

module.exports = {
    getMiddlewareState,
    createMiddlewareState,
    updateMiddlewareState,
    middlewareFormattedOutput
};
