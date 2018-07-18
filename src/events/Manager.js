const EventEmitter = require('events').EventEmitter;
const EVENTS = {
    OUTPUT_LOG_INFO: 'OUTPUT_LOG_INFO',
    OUTPUT_LOG_ERROR: 'OUTPUT_LOG_ERROR',
    OUTPUT_LOG_WARNING: 'OUTPUT_LOG_WARNING',
    FUNCTION_LIST_READY: 'FUNCTION_LIST_READY',
    PROXY_START_DDB: 'PROXY_START_DDB',
};

class EventsManager {

    /**
     * Constructor
     *
     */
    constructor() {
        this.emitter = new EventEmitter();
        this.eventsList = {
            [EVENTS.FUNCTION_LIST_READY]: EVENTS.FUNCTION_LIST_READY,
            [EVENTS.PROXY_START_DDB]: EVENTS.PROXY_START_DDB,
            [EVENTS.OUTPUT_LOG_INFO]: EVENTS.OUTPUT_LOG_INFO,
            [EVENTS.OUTPUT_LOG_ERROR]: EVENTS.OUTPUT_LOG_ERROR,
            [EVENTS.OUTPUT_LOG_WARNING]: EVENTS.OUTPUT_LOG_WARNING,
        }
    }

    /**
     * BindEvent
     *
     */
    bind(eventType, resolver) {
        this.emitter.on(eventType, resolver)
    }

    /**
     * Emit
     *
     * @param eventType
     * @param data
     */
    emit(eventType, data) {
        this.emitter.emit(eventType, data);
    }
}

module.exports = new EventsManager;
