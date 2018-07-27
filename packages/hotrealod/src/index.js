const chokidar = require('chokidar')
const watcher = chokidar.watch(`${process.cwd()}/src`)
const EventsManager = require('@serverless-local-proxy/events_manager')
watcher.on('ready', () => {
  watcher.on('all', () => {
    EventsManager.emit(EventsManager.eventsList.OUTPUT_LOG_INFO, 'Cache invalidated')
    // TODO: @diego[fix] It's a quite brutal cache invalidation..
    // TODO: Should delete by script id, it also true that doesn't require a lot of modules after started.
    // TODO: needs tests with different OS and projects, I'm also not sure about cwd
    Object.keys(require.cache).forEach((id) => delete require.cache[id])
  })
})
