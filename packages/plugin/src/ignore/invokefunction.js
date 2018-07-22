const invokeFunction = async (ctx, next, functionName, functionPath, payload) => {
  if (typeof functionName === 'undefined' || typeof functionPath === 'undefined' || typeof payload === 'undefined') {
    throw new Error('InvokeFunction middleware requires as input functionName, functionPath, payload')
  }
  const handler = require(functionPath)[functionName]
  try {
    await handler(payload, ctx, result => {
      ctx.state.output = result
    })
  } catch (e) {
    ctx.state.output = e
  }
}

module.exports = { invokeFunction }
