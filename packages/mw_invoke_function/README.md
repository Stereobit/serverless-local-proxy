# INVOKE FUNCTION MIDDLEWARE

N.B. This package is part of the monorepo serverless-local-proxy

## State

| Aspects input                  | Produces output                                                       |
|--------------------------------|------------------------------------------------------------------------|
| invokeFunctionName : string    | invokedFunction : Object<{functionName:string, functionPayload:<any>}> |
| invokeFunctionPath : string    | invokedFunction.payload: Object<any>                                   |
| invokeFunctionPayload : string | invokedFunction.callback: Object<{error:string, result:<any>}          |
|                                | invokedFunction.exception: string                                      |
|                                |                                                                        |
|                                |                                                                        |
