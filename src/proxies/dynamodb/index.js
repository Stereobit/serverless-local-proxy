const koa = require('koa');
const body = require('koa-json-body');
const index = require('koa-proxy');
const convert = require('koa-convert');
const { terraformSupport } = require('./middlewares/terraform_support');
const { dynamoTriggers } = require('./middlewares/dynamo_triggers');

const DynamoDbProxy = ({ enabled, proxy_host, proxy_port, dynamo_db_host }) => {
    if (enabled === false)
        return null;

    const app = new koa();
    app.use(convert(body({ limit: '10kb', fallback: true })));
    app.use(terraformSupport);
    app.use(dynamoTriggers);
    app.use(convert(index({ host: dynamo_db_host }))).listen(proxy_port);
    console.log(`Started DynamoDb proxy at ${proxy_host}:${proxy_port}`);
};

module.exports = { DynamoDbProxy }