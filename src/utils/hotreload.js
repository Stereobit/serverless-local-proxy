const chokidar = require('chokidar');
const watcher = chokidar.watch(`${process.cwd()}/src`);
const EventManager = require('../events/Manager');
watcher.on('ready', () => {
    watcher.on('all', () => {
        EventManager.emit(EventManager.eventsList.OUTPUT_LOG_INFO, 'Modules cache invalidation');
        // TODO: @diego[fix] It's a bit brutal cache invalidation.
        // TODO: Should delete by script id, it also true that doesn't require a lot of modules after started.
        // TODO: needs tests with different OS and projects, I'm also not sure about cwd
        Object.keys(require.cache).forEach((id) => delete require.cache[id]);
    })
});
