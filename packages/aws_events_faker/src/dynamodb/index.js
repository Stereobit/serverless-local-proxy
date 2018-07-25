const insert = () => {
  //TODO
  return {}
}

const remove = () => {
  //TODO
  return {}
}

const modify = (payload) => {
  return {
    'NewImage': payload,
    'OldImage': payload,
    'SequenceNumber': '222',
    'Keys': {
      'Id': {
        'N': '101'
      }
    },
    'SizeBytes': 59,
    'StreamViewType': 'NEW_AND_OLD_IMAGES'
  }
}

/**
 * DynamoDBEvent
 *
 * @param eventType
 * @param payload
 * @param arn
 * @return {{Records: *[]}}
 * @constructor
 */
const dynamoDBEvent = (eventType, payload, arn = 'aws:dynamodb:test:') => {

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
        'eventName': '',
        'eventSourceARN': arn,
        'eventSource': 'aws:dynamodb',
        'dynamodb': modify(payload)
      }
    ]
  }
}

module.exports = {dynamoDBEvent}
