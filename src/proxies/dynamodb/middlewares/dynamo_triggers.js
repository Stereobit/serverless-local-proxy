const dynamoTriggers = async (ctx, next) => {
    // console.log(ctx.request.body);
    //const data = await extractData(ctx.req);
    // console.log(data);
    return next();
};

module.exports = { dynamoTriggers };