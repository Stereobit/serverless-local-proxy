const MIDDLEWARE_NAME = 'ddb_mock_api'

/**
 * Factory
 *
 * @return {function(*, *): *}
 */
const factory = () => {
  return {
    factoryType: 'SERVER',
    resolver: async (ctx, next) => {
      const tableTtlMap = {}

      if (ctx.header['x-amz-target'] === 'DynamoDB_20120810.UpdateTimeToLive') {
        tableTtlMap[ctx.request.body['TableName']] = {
          'AttributeName': ctx.request.body['TimeToLiveSpecification']['AttributeName'],
          'Status': ctx.request.body['TimeToLiveSpecification']['Enabled']
        }
        ctx.body = {
          'TimeToLiveSpecification': ctx.request.body['TimeToLiveSpecification']
        }
        return
      }

      if (ctx.header['x-amz-target'] === 'DynamoDB_20120810.DescribeTimeToLive') {
        if (!tableTtlMap[ctx.request.body['TableName']]) {
          ctx.body = {
            'TimeToLiveDescription': {
              'TimeToLiveStatus': 'DISABLED'
            }
          }
        } else {
          ctx.body = {
            'TimeToLiveDescription': {
              'AttributeName': tableTtlMap[ctx.request.body['TableName']]['AttributeName'],
              'TimeToLiveStatus': tableTtlMap[ctx.request.body['TableName']]['Status'] ? 'ENABLED' : 'DISABLED'
            }
          }
        }
        return
      }

      if (ctx.header['x-amz-target'] === 'DynamoDB_20120810.TagResource' || ctx.header['x-amz-target'] === 'DynamoDB_20120810.UntagResource') {
        ctx.status = 200
        return
      }

      if (ctx.header['x-amz-target'] === 'DynamoDB_20120810.ListTagsOfResource') {
        ctx.body = {}
        return
      }

      if (ctx.path === '/shell') {
        ctx.redirect('shell/')
        return
      }

      return await next()
    }
  }
}

module.exports = {factory, MIDDLEWARE_NAME}
