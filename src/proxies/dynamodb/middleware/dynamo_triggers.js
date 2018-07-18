const dynamoDbTriggers = async (ctx, next) => {
    return next();
};

module.exports = { dynamoDbTriggers };
