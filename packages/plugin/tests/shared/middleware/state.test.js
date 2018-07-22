const { factory } = require('../../../src/shared/middleware/state/injectstore');

const { testMiddleware } = require('../../library/middleware');

testMiddleware(factory, 'shared::middleware:state');
