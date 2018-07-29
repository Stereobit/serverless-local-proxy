[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![Build Status](https://travis-ci.org/serverless-local-proxy/serverless-local-proxy.svg?branch=master)](https://travis-ci.org/serverless-local-proxy/serverless-local-proxy)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

<p align="center">
  <img src="docs/logo.png" width="100%" />
</p>

# serverless-local-proxy

A highly composable JS plugin for [Serverless](https://serverless.com/) that speeds up your development workflow.

Key features:
- Fully customizable middleware architecture
- Hot-reload Serverless source code
- Easy to configure and customize

Take a look to [DynamoDB triggers](#example-emulate-aws-dynamodb-triggers-in-your-local-env) or [Converting Lambda functions to HTTP endpoints](#example-converting-lambda-functions-to-http-endpoints) examples in order to have a quick overview

Due to the weak documentation, you can refer to the [demo project](https://github.com/serverless-local-proxy/demo-project).

N.B.
The current version is far away to be stable.
It's a prototype that works for some specific cases.

If you like it, please get in touch, contributors are more then welcome.

# Table of contents

[Installing](#installing)
 
[Available Proxies](#available-proxies)
 - [FunctionsProxy](#FunctionsProxy) 
 - [DynamoDBProxy](#DynamoDBProxy)
 
[Available Middleware](#available-middleware)
 - [ddb_mock_api](#ddb_mock_api)
 - [ddb_query_logger](#ddb_query_logger)
 - [ddb_trigger](#ddb_trigger)
 - [functions_to_http](#functions_to_http)
 - [http_request_logger](#http_request_logger)
 - [invoke_function](#invoke_function)
 - [invoke_http_function](#invoke_http_function)
 - [payload_to_aws_event](#payload_to_aws_event)
 - [state_inject](#state_inject)
 
[Proxy and middleware a quick introduction](#proxy-and-middleware-a-quick-introduction)
 - [Middleware state](#middleware-state)
 
## Installing

Installing the package

```bash
yarn add serverless-local-proxy --dev 
# or npm
npm install serverless-local-proxy --dev

```

Edit your serverless.yml file
```yaml

[...]
# Add a custom section as follows ( you can customize the path )
custom:
  localProxy: ${file(./config/local_proxy.yml)}
[...]

[...]
# List the plugin in the specific plugin section
plugins:
  - serverless-local-proxy
[...]
```

Create the file local_proxy.yml in the directory config ( or to the path you have chosen ) and insert at least the entry key

```yaml
proxies:

```

In order to run the plugin
 
```bash
sls proxy start
# or
serverless proxy start
```

You should get an error about that there aren't available proxies to configure, that's because we didn't configure any proxies yet
 
 
## Available Proxies 

### FunctionsProxy
FunctionProxy is designed to work with your service' functions
You can attach middleware on it in order to test rapidly your functions in your local environment

### DynamoDBProxy
DynamoDBProxy is built to catch operations to the DynamoDB server.
You can easily log query or trigger actions based on specific events

## Available Middleware

### ddb_mock_api

This middleware mocks the APIs that DynamoDB local doesn't have ( like DescribeTimeToLive, tags etc )
It's useful if you use tools that require those APIs like [Terraform](https://www.terraform.io/) ( [issue](https://github.com/terraform-providers/terraform-provider-aws/issues/1059) ).
It also allows you to redirect to the local DynamoDB /shell

Middleware state

| Input | Output |
| --- | --- |
| none | none |

### ddb_query_logger

Will produce a log row for any queries to DynamoDB

Middleware state

| Input | Output |
| --- | --- |
| none | none |

### ddb_trigger

Emulates the DynamoDB' trigger functionality 
It's used in combination with [invoke_function](#invoke_function)

Middleware state

| Input | Output |
| --- | --- |
| none | invokeFunctionName:String |
|      | invokeFunctionPath:String |
|      | invokeFunctionPayload:Any |

### functions_to_http

Will expose all the service's function to HTTP endpoint.

Middleware state

| Input | Output |
| --- | --- |
| none | invokeFunctionName:String |
|      | invokeFunctionPath:String |
|      | invokeFunctionPayload:Any |

### http_request_logger

Will produce a log row for each HTTP request to the proxy where is attached to
 
Middleware state

| Input | Output |
| --- | --- |
| none | none |

### invoke_function

Will invoke a service' function an will log the result

Middleware state

| Input | Output |
| --- | --- |
| invokeFunctionName:String | invokedFunction:Object { functionName:String, payload:Any, exception:String, callback:Object { error:String, result:Any}  } |
| invokeFunctionPath:String |  |
| invokeFunctionPayload:Any |  |

### invoke_http_function
coming soon...

### payload_to_aws_event

Will transform a request payload to an [AWS event](https://docs.aws.amazon.com/lambda/latest/dg/eventsources.html)

Middleware state

| Input | Output |
| --- | --- |
| invokeFunctionPayload:Any | invokeFunctionPayload:AWSEventObject |
| invokeFunctionName:String |  |


### state_inject

Will inject a new state key/value in the middleware state context

| Input | Output |
| --- | --- |
|  none | newKey:NewValue |
|  |  |

# Proxy and middleware a quick introduction

Serverless local proxy (SLP) is entirely built on top of [Koa](https://koajs.com/) 

Koa uses a structure based on middleware and SLP leverages this very flexible approach.

Basically, a proxy is a Koa server and a middleware is Koa middleware function. 

Middleware are completely separated from each other and you can chain them without any relations.
However, some of them work very well together in a specific order.

You can use a middleware in combination with all the available proxies, however, some of them are designed specifically for a kind of proxy.

For example, you can use a DynamoDB middleware to work with the FunctionsProxy but will not produce any result.

# Middleware state

Middleware use a mono-directional shared state managed by [ImmutableJS](https://facebook.github.io/immutable-js/) in order to communicate.

The state is passed across the middleware chain with the [Koa context](https://github.com/koajs/koa/blob/master/docs/api/context.md) and every single middleware can override or produce a new segment of the state.

This is how looks the state direction in the middleware chain

<img src="docs/middleware_state_direction.png" />

The proxy service will inject the input of the chain then each middleware will refer to the output section of the state.

Basically, each middleware produces an output state for the next middleware, for that reason the middleware order in the chain matters.

Let's consider the following scenario:

Middleware A 

| Input | Output |
| --- | --- |
| none | functionName:String |

Middleware B

| Input | Output |
| --- | --- |
| functionName:String | none |

You can use the middleware in the following order to obtain the desired result:

```yaml
middleware:
    middleware-a
    middleware-b
```

But if you invert the order

```yaml
middleware:
    middleware-b
    middleware-a
```

The result will not be the same even if you'll not get any error.

Keep in mind that the state is a merge operation across the middleware chain.

Consider the following scenario:

Middleware A 

| Input | Output |
| --- | --- |
| none | functionName:String |

Middleware B

| Input | Output |
| --- | --- |
| functionName:String | none |

Middleware C

| Input | Output |
| --- | --- |
| functionName:String | none |

The chain stills valid because the section produced by the middleware A will be available also to the middleware C.
 
## Example Converting Lambda functions to HTTP endpoints

Let's say that we want to develop a new Lambda function and we want to quickly debug it in our local environment without publish the function to AWS.
For this purpose, we will enable the Functions proxy.

We will attach to the FunctionsProxy 3 middleware:

***functions_to_http***
 
Which will transform your service's functions to HTTP endpoints

***http_request_logger***

Which will produce a log row for every incoming HTTP request to the endpoints

***invoke_function***

Which will invoke our function and will log the result


We can now create a new CURL POST request ( in the example is used [Resty](https://github.com/micha/resty) tool ) to the function endpoint and check our function result

We can also change the function source code without restart the proxy because the source code will be automatic reload on any changes

<img src="docs/functions-to-http.gif" width="100%" />

## Example Emulate AWS DynamoDB triggers in your local env

Let's say that we want to emulate the AWS DynamoDB trigger functionality which basically invokes a Lambda function when database' record changes

So, when a record changes in the user table we want to invoke the function userTrigger

In order to do that we need to enable the DynamoDB proxy

Also, we will attach to the proxy the following middleware

***ddb_query_logger***
 
Which will log all the queries to DynamoDB 

***ddb_trigger***

Which will parse all the queries looking for triggers configured in the config file

***payload_to_aws_event***

This middleware will transform the request' payload into an AWS event ( in this case DYNAMODB_MODIFY )

***invoke_function***

Which will invoke our function and will log the result 


For this example we need a DynamoDB instance running in our local environment.
We can easily archive that with [Docker](https://www.docker.com/):

```bash
# Will install and run DynamoDB database on the port 8000
docker run -v "$PWD":/dynamodb_local_db -p 8000:8000 cnadiminti/dynamodb-local:latest
# Create the users table
aws dynamodb create-table --table-name users --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 --endpoint-url http://0.0.0.0:8000 --region local

```

<img src="docs/dynamodb-trigger.gif" width="100%" />
