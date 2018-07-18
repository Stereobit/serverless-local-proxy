const manifest = require('../../config/manifest');
const { Utils } = require('../utils/Utils');
const AWS = require('aws-sdk');
const EventsManager = require('../events/Manager');
const chalk = require('chalk');

const AVAILABLE_PROXIES = {
    DYNAMODB: 'dynamodb',
    FUNCTIONS: 'functions'
};
const LOGGER_LEVELS = { INFO: 'INFO', ERROR: 'ERROR', WARNING: 'WARNING', NO_TAGS: 'NO_TAGS' };
const LOGGER_PREFIX = '[SERVERLESS-PROXY]';

class Plugin {

    /**
     * Constructor
     *
     * @param serverless
     * @param options
     */
    constructor(serverless, options) {
        this.serverless = serverless;
        this.options = options;
        this.hooks = this.configureHooks();
        this.commands = manifest;
        this.functionsCollection = new Map();
        EventsManager.bind(EventsManager.eventsList.OUTPUT_LOG_INFO, (message) => this.log(message, LOGGER_LEVELS.INFO));
        EventsManager.bind(EventsManager.eventsList.OUTPUT_LOG_ERROR, (message) => this.log(message, LOGGER_LEVELS.ERROR));
        EventsManager.bind(EventsManager.eventsList.OUTPUT_LOG_WARNING, (message) => this.log(message, LOGGER_LEVELS.WARNING));
    }

    /**
     * ConfigureHooks
     *
     * @return {{
     *  "before:proxy:start:init": Function,
     *  "proxy:start:init": Function,
     *  "after:proxy:start:init": Function,
     *  "before:proxy:stop:end": Function,
     *  "proxy:stop:end": Function,
     *  "after:proxy:stop:end": Function
     *  }}
     */
    configureHooks() {
        return {
            'before:proxy:start:init': this.beforeStart.bind(this),
            'proxy:start:init': this.proxyStart.bind(this),
            'after:proxy:start:init': this.afterStart.bind(this)
        }
    }

    /**
     * ConfigureProxies
     *
     */
    configureProxies() {
        this.log('Configuring proxies');
        const proxiesConfig = this.serverless.service.custom.serverlessProxy;
        proxiesConfig.proxies.map(proxy => {

            // Dynamo Proxy
            if (proxy.hasOwnProperty(AVAILABLE_PROXIES.DYNAMODB) && proxy[AVAILABLE_PROXIES.DYNAMODB].isActive) {
                EventsManager.emit(
                    EventsManager.eventsList.PROXY_START_DDB,
                    {
                        config: proxy[AVAILABLE_PROXIES.DYNAMODB],
                        functions: this.functionsCollection[Symbol.iterator]()
                    }
                );
            }

            // Functions Proxy
            if (proxy.hasOwnProperty(AVAILABLE_PROXIES.FUNCTIONS) && proxy[AVAILABLE_PROXIES.FUNCTIONS].isActive) {
                EventsManager.emit(
                    EventsManager.eventsList.PROXY_START_FUNCTIONS_TO_HTTP,
                    {
                        config: proxy[AVAILABLE_PROXIES.FUNCTIONS],
                        functions: this.functionsCollection
                    }
                );
            }

        });
    }

    /**
     * ConfigureFunctions
     *
     */
    configureFunctions() {
        this.log('Configuring functions');
        Utils.extractFunctionsList(this.serverless.service.functions)
            .forEach(functionDetails =>
                this.functionsCollection.set(functionDetails.name, functionDetails));
        EventsManager.emit(EventsManager.eventsList.FUNCTION_LIST_READY, this.functionsCollection[Symbol.iterator]());
    }

    /**
     * ConfigureEnvironment
     *
     */
    configureEnvironment() {
        this.log('Configuring environment');
        // TODO: @diego[FIX] There is probably a better way to retrieves credentials in the Serverless framework...
        const awsCredentials = new AWS.SharedIniFileCredentials({ profile: this.serverless.service.provider.profile });
        process.env.AWS_ACCESS_KEY_ID = awsCredentials.accessKeyId;
        process.env.AWS_SECRET_ACCESS_KEY = awsCredentials.secretAccessKey;
        process.env.AWS_SESSION_TOKEN = awsCredentials.sessionToken;
        const envVars = this.serverless.service.provider.environment;
        Object.keys(envVars).map(envKey => process.env[envKey] = envVars[envKey]);
    }

    /**
     * Log
     *
     * @param {string} message
     * @param {string} level
     */
    log(message, level = LOGGER_LEVELS.INFO) {
        switch (level) {
            case LOGGER_LEVELS.INFO:
                return this.serverless.cli.log(`${LOGGER_PREFIX}[${LOGGER_LEVELS.INFO}] ${message}`);
            case LOGGER_LEVELS.ERROR:
                return this.serverless.cli.log(chalk.red(`${LOGGER_PREFIX}[${LOGGER_LEVELS.ERROR}] ☠️  ${message}`));
            case LOGGER_LEVELS.WARNING:
                return this.serverless.cli.log(`${LOGGER_PREFIX}[${LOGGER_LEVELS.WARNING}] ⚠️️ ${message}`);
            case LOGGER_LEVELS.NO_TAGS:
            default:
                return this.serverless.cli.log(message);
        }
    }

    /**
     * BeforeStart
     *
     */
    beforeStart() {
        this.log(Utils.asciiGreeting(), LOGGER_LEVELS.NO_TAGS);
        this.configureEnvironment();
        this.configureFunctions();
        this.configureProxies();
    }

    /**
     * ProxyStart
     */
    proxyStart() {
        this.log('Proxy start command done');
    }

    /**
     * AfterStart
     */
    afterStart() {
        this.log('All proxies were loaded');
    }
}

module.exports = Plugin;
