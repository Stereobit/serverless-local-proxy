/**
 * Insert
 *
 * TODO: @diego[feature]
 * @return {{}}
 */
const insert = () => {
  return {}
}

/**
 * Remove
 *
 * TODO: @diego[feature]
 * @return {{}}
 */
const remove = () => {
  // TODO
  return {}
}

/**
 * Modify
 *
 * TODO: @diego[feature]
 * @return {{}}
 */
const modify = (payload) => {
  return {
    'NewImage': payload,
    'OldImage': payload,
    'SequenceNumber': '222',
    'Keys': {
      'Id': {
        'S': '101'
      }
    },
    'SizeBytes': 59,
    'StreamViewType': 'NEW_AND_OLD_IMAGES'
  }
}

/**
 * DynamoDBEvent
 *
 * TODO: @diego[feature]
 * @param eventType
 * @param payload
 * @param arn
 * @return {{Records: *[]}}
 */
const dynamoDBEvent = (eventType, payload, arn = 'aws:dynamodb') => {
  const events = {
    REMOVE: 'REMOVE',
    MODIFY: 'MODIFY',
    INSERT: 'INSERT'
  }
  return {
    Records: [
      {
        'eventID': '3',
        'eventVersion': '1.0',
        'awsRegion': 'us-west-2',
        'eventName': 'MODIFY',
        'eventSourceARN': arn,
        'eventSource': 'aws:dynamodb',
        'dynamodb': modify(payload.Item) // TODO: Extract Item
      }
    ]
  }
}

module.exports = {dynamoDBEvent}
