const { Client: DynamoDBClient } = require('../lib/Client');
const TABLE_NAME = 'crudtest_serveless_local_proxy';
const { getMiddlewareState } = require('../../../utils/middleware');

const tableSettings = {
    AttributeDefinitions: [
        {
            AttributeName: 'id',
            AttributeType: 'S'
        },
    ],
    KeySchema: [
        {
            AttributeName: 'id',
            KeyType: 'HASH'
        },
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
    },
    TableName: TABLE_NAME
};


/**
 * Factory
 *
 * @return {function(*, *): *}
 */
const factory = (config) => {
    const { name: middlewareName } = config.middlewareConfig;
    const { dynamo_db_host } = config.proxyConfig;
    return {
        factoryType: 'SERVER',
        resolver: async (ctx, next) => {
            return await next();
            //const client = new DynamoDBClient(dynamo_db_host);
            //const tables = await client.listTables();
            //console.log(tables);
            //
            /**/

            //const result = await client.createTable(tableSettings);
            //console.log(tables);
            // const result = await client.putItem(TABLE_NAME, { id: "diego" });
        }
    }
};


module.exports = { factory };
