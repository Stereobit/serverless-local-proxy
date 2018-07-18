const invoke = async (ctx, next, functionName, functionPath) => {
    try {
        const handler = require(functionPath)[functionName];
        console.log(await handler());
    }
    catch (e) {
        console.log(e);
    }

    ctx.body = 'Hello!!';
    return next();
};

module.exports = { invoke };
