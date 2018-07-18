const invoke = async (ctx, next, functionName, functionPath) => {
    try {
        const handler = require(functionPath)[functionName];
        console.log(await handler());
    }
    catch (e) {
        console.log(e);
    }
    return next();
};

module.exports = { invoke };
