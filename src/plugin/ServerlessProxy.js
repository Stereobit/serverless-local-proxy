const manifest = require('../../config/manifest');
const { Utils } = require('../utils/Utils');
const EventsManager = require('../events/Manager');
const chalk = require('chalk');

const AVAILABLE_PROXIES = {
    DYNAMODB: 'dynamodb',
    FUNCTIONS_TO_HTTP: 'functionsToHttp'
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
        this.hooks = this.configureHooks();
        this.commands = manifest;
        this.options = options;
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
            'after:proxy:start:init': this.afterStart.bind(this),
            'before:proxy:stop:end': this.beforeStop.bind(this),
            'proxy:stop:end': this.proxyStop.bind(this),
            'after:proxy:stop:end': this.afterStop.bind(this),
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
            if (proxy.hasOwnProperty(AVAILABLE_PROXIES.FUNCTIONS_TO_HTTP) && proxy[AVAILABLE_PROXIES.FUNCTIONS_TO_HTTP].isActive) {
                EventsManager.emit(
                    EventsManager.eventsList.PROXY_START_FUNCTIONS_TO_HTTP,
                    {
                        config: proxy[AVAILABLE_PROXIES.FUNCTIONS_TO_HTTP],
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
            .forEach(functionDetails => this.functionsCollection.set(functionDetails.name, functionDetails));
        EventsManager.emit(EventsManager.eventsList.FUNCTION_LIST_READY, this.functionsCollection[Symbol.iterator]());
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
                return this.serverless.cli.log(`${LOGGER_PREFIX}[${LOGGER_LEVELS.ERROR}] ☠️  ${message}`);

            case LOGGER_LEVELS.WARNING:
                return this.serverless.cli.log(`${LOGGER_PREFIX}[${LOGGER_LEVELS.WARNING}] ⚠️️ ${message}`);

            case LOGGER_LEVELS.NO_TAGS:
            default:
                break;

        }
        this.serverless.cli.log(message);
    }

    /**
     * BeforeStart
     *
     */
    beforeStart() {
        this.log(Utils.asciiGreeting(), LOGGER_LEVELS.NO_TAGS);
        this.configureFunctions();
        this.configureProxies();
    }

    /**
     * ProxyStart
     */
    proxyStart() {

    }

    /**
     * AfterStart
     */
    afterStart() {
        this.log('All proxies are loaded')
    }

    /**
     * BeforeStop
     */
    beforeStop() {

    }

    /**
     * ProxyStop
     */
    proxyStop() {

    }

    /**
     * AfterStop
     */
    afterStop() {

    }
}

module.exports = Plugin;
