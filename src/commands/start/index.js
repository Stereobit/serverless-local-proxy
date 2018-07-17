const fs = require('fs');
const yml = require('js-yaml');
const { DynamoDbProxy } = require('../../proxies/dynamodb');
const { ENUMS } = require('../../config/enums');

const start = async (ymlPath) => {

    if (fs.existsSync(ymlPath) === false) {
        throw new Error("Config yml path doest not exist");
    }

    const proxyConfig = yml.safeLoad(fs.readFileSync(ymlPath, 'utf8'));
    if (proxyConfig.proxies) {
        proxyConfig.proxies.map(proxy => {
            if (proxy.hasOwnProperty(ENUMS.PROXIES.DYNAMODB)) {
                DynamoDbProxy(proxy[ENUMS.PROXIES.DYNAMODB]);
            }
        });
    }
};


module.exports = start