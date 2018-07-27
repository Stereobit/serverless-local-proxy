[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![Build Status](https://travis-ci.org/useless-stuff/serverless-local-proxy.svg?branch=master)](https://travis-ci.org/useless-stuff/serverless-local-proxy)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

 
# Serverless-proxy

A highly composable plugin for Serverless that speeds up your development workflow.

Some key features:
Koa middleware architecture fully customizable, hot-reload of your source code, easy to configure and fast to learn   

### What you actually can do with serverless-local-proxy

Lets say that you want to develop a new Lambda function, what you need is the FunctionsProxy
[coming soon...]

### Installing
Install the package
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

Create the file local_proxy.yml in the directory config ( or to the path you have chosen )
