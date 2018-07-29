const fs = require('fs')

class Utils {
  /**
   * ExtractFunctionsFromServerless
   *
   * @param functions
   */
  static extractFunctionsList (functions) {
    return Object.keys(functions)
      .map(functionKey => {
        const {path, name} = Utils.extractFunctionPathFromHandler(functions[functionKey].handler)
        return {
          name,
          path,
          slsConfig: functions[functionKey]
        }
      })
  }

  /**
   * ExtractFunctionPathFromHandler
   *
   * @param {string} functionHandler
   * @return {{path: string, name: string}}
   */
  static extractFunctionPathFromHandler (functionHandler) {
    const functionPath = `${process.cwd()}/${functionHandler}`.split('.')
    if (!functionPath[0] || !functionPath[1]) {
      throw new Error('Invalid function path')
    }
    return {
      path: functionPath[0],
      name: functionPath[1]
    }
  }

  static asciiGreeting () {
    const path = `${process.cwd()}/node_modules/serverless-local-proxy/package.json`
    let packageInfo = {}
    packageInfo.version = '0.0.0.development'
    if (fs.existsSync(path)) {
      packageInfo = require(path)
    }
    return `
                               _                     _                 _                                 
  ___  ___ _ ____   _____ _ __| | ___  ___ ___      | | ___   ___ __ _| |      _ __  _ __ _____  ___   _ 
 / __|/ _ \\ '__\\ \\ / / _ \\ '__| |/ _ \\/ __/ __|_____| |/ _ \\ / __/ _\` | |_____| '_ \\| '__/ _ \\ \\/ / | | |
 \\__ \\  __/ |   \\ V /  __/ |  | |  __/\\__ \\__ \\_____| | (_) | (_| (_| | |_____| |_) | | | (_) >  <| |_| |
 |___/\\___|_|    \\_/ \\___|_|  |_|\\___||___/___/     |_|\\___/ \\___\\__,_|_|     | .__/|_|  \\___/_/\\_\\\\__, |
                                                                              |_|                  |___/ 
 Version: ${packageInfo.version}                                                                                     
`
  }
}

module.exports = {Utils}
