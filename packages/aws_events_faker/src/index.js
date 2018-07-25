const {dynamoDBEvent} = require('./dynamodb')
const SUPPORTED_EVENTS = {
  DYNAMODB_MODIFY: 'DYNAMODB_MODIFY'
}

/**
 * A basic version of what it should does
 */
const awsEventsFaker = (eventType, payload) => {
  switch (eventType) {
    case SUPPORTED_EVENTS.DYNAMODB_MODIFY:
      return dynamoDBEvent(SUPPORTED_EVENTS.DYNAMODB_MODIFY, payload)
  }
}

module.exports = {awsEventsFaker}
