const { factory } = require('../../../src/shared/middleware/state/stateinit');

const { testMiddleware } = require('../../library/middleware');

testMiddleware(factory, 'shared::middleware:state');
