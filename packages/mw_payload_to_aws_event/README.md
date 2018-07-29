# PAYLOAD TO AWS EVENT

Will transform a request payload to an [AWS event](https://docs.aws.amazon.com/lambda/latest/dg/eventsources.html)

## Name:
payload_to_aws_event

## Middleware state

| Input | Output |
| --- | --- |
| invokeFunctionPayload:Any | invokeFunctionPayload:AWSEventObject} |
| invokeFunctionName:String |  |

N.B. 
This package is part of the monorepo [serverless-local-proxy](https://github.com/serverless-local-proxy/serverless-local-proxy)






