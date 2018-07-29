# DDB MOCK API

This middleware mocks the APIs that DynamoDB local doesn't have ( like DescribeTimeToLive, tags etc )
It's useful if you use tools that require those APIs like [Terraform](https://www.terraform.io/) ( [issue](https://github.com/terraform-providers/terraform-provider-aws/issues/1059) ).
It also allows you to redirect to the local DynamoDB /shell

## Name:
ddb_mock_api

## Middleware state

| Input | Output |
| --- | --- |
| none | none |

N.B. 
This package is part of the monorepo [serverless-local-proxy](https://github.com/serverless-local-proxy/serverless-local-proxy)



