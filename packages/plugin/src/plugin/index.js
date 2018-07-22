const manifest = require('../../config/manifest')
const {store} = require('../redux')
const EventsManager = require('@serverless-local-proxy/events_manager')
const {Utils} = require('../utils/utils')
const {mapMiddlewareSettingsToFunctions} = require('../utils/functions')
const AWS = require('aws-sdk')
const chalk = require('chalk')
const AVAILABLE_PROXIES = {
  DYNAMODB: 'dynamodb',
  FUNCTIONS: 'functions'
}
const LOGGER_LEVEL = {INFO: 'INFO', ERROR: 'ERROR', WARNING: 'WARNING', NO_TAGS: 'NO_TAGS'}
const LOGGER_PREFIX = '[SLS-LOCAL-PROXY]'

class Plugin {

  /**
   * Constructor
   *
   * @param serverless
   * @param options
   */
  constructor (serverless, options) {
    this.serverless = serverless
    this.options = options
    this.hooks = this.configureHooks()
    this.commands = manifest
    this.functionsCollection = new Map()
    EventsManager.bind(EventsManager.eventsList.OUTPUT_LOG_INFO, (message) => this.log(message, LOGGER_LEVEL.INFO))
    EventsManager.bind(EventsManager.eventsList.OUTPUT_LOG_ERROR, (message) => this.log(message, LOGGER_LEVEL.ERROR))
    EventsManager.bind(EventsManager.eventsList.OUTPUT_LOG_WARNING, (message) => this.log(message, LOGGER_LEVEL.WARNING))
    EventsManager.bind(EventsManager.eventsList.OUTPUT_MIDDLEWARE, (message) => this.log(message, LOGGER_LEVEL.NO_TAGS))
  }

  /**
   * ConfigureHooks
   *
   * @return {{
     *  "before:proxy:start:init": Function,
     *  "proxy:start:init": Function,
     *  "after:proxy:start:init": Function,
     *  }}
   */
  configureHooks () {
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
  configureProxies () {
    this.log('Configuring proxies')
    const proxiesConfig = this.serverless.service.custom.serverlessProxy

    proxiesConfig.proxies.map(proxy => {
      // Dynamo Proxy
      if (proxy.hasOwnProperty(AVAILABLE_PROXIES.DYNAMODB) && proxy[AVAILABLE_PROXIES.DYNAMODB].isActive) {
        EventsManager.emit(
          EventsManager.eventsList.PROXY_START_DDB,
          {
            store,
            config: proxy[AVAILABLE_PROXIES.DYNAMODB],
            serviceFunctions: Array.from(this.functionsCollection.values())
          }
        )
      }
      // Functions Proxy
      if (proxy.hasOwnProperty(AVAILABLE_PROXIES.FUNCTIONS) && proxy[AVAILABLE_PROXIES.FUNCTIONS].isActive) {
        EventsManager.emit(
          EventsManager.eventsList.PROXY_START_FUNCTIONS,
          {
            store,
            config: proxy[AVAILABLE_PROXIES.FUNCTIONS],
            serviceFunctions: mapMiddlewareSettingsToFunctions(
              Array.from(this.functionsCollection.values()),
              proxy[AVAILABLE_PROXIES.FUNCTIONS].configFunctions
            ),
          }
        )
      }
    })
  }

  /**
   * ConfigureFunctions
   *
   */
  configureFunctions () {
    this.log('Configuring functions')
    Utils.extractFunctionsList(this.serverless.service.functions)
      .forEach(functionDetails =>
        this.functionsCollection.set(functionDetails.name, functionDetails))
    EventsManager.emit(EventsManager.eventsList.FUNCTION_LIST_READY, this.functionsCollection[Symbol.iterator]())
  }

  /**
   * ConfigureEnvironment
   *
   */
  configureEnvironment () {
    this.log('Configuring environment')
    // TODO: @diego[FIX] Probably, there is a better way to retrieve credentials in the Serverless framework...
    const awsCredentials = new AWS.SharedIniFileCredentials({profile: this.serverless.service.provider.profile})
    process.env.AWS_ACCESS_KEY_ID = awsCredentials.accessKeyId
    process.env.AWS_SECRET_ACCESS_KEY = awsCredentials.secretAccessKey
    process.env.AWS_SESSION_TOKEN = awsCredentials.sessionToken
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      this.log('AWS credentials are empty', LOGGER_LEVEL.WARNING)
    }
    const envVars = this.serverless.service.provider.environment
    Object.keys(envVars).map(envKey => process.env[envKey] = envVars[envKey])
  }

  /**
   * Log
   *
   * @param {string} message
   * @param {string} level
   */
  log (message, level = LOGGER_LEVEL.INFO) {
    switch (level) {
      case LOGGER_LEVEL.INFO:
        return this.serverless.cli.log(`${LOGGER_PREFIX}[${LOGGER_LEVEL.INFO}] ${message}`)
      case LOGGER_LEVEL.ERROR:
        return this.serverless.cli.log(chalk.red(`${LOGGER_PREFIX}[${LOGGER_LEVEL.ERROR}] ☠️  ${message}`))
      case LOGGER_LEVEL.WARNING:
        return this.serverless.cli.log(`${LOGGER_PREFIX}[${LOGGER_LEVEL.WARNING}] ⚠️️  ${message}`)
      case LOGGER_LEVEL.NO_TAGS:
      default:
        console.log(message)
    }
  }

  /**
   * BeforeStart
   *
   */
  beforeStart () {
    this.log(Utils.asciiGreeting(), LOGGER_LEVEL.NO_TAGS)
    this.configureEnvironment()
    this.configureFunctions()
    this.configureProxies()
  }

  /**
   * ProxyStart
   */
  proxyStart () {
    this.log('Proxy start command done')
  }

  /**
   * AfterStart
   */
  afterStart () {
    this.log(`All proxies were loaded\n`)
  }
}

module.exports = {Plugin}
