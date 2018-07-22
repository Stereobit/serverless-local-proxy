const testMiddleware = (middleware, middlewareName) => {
    describe('Library::', () => {
        describe(`Middleware::${middlewareName}`, () => {
            test('Check if exist', () => {
                expect(typeof middleware).toBe("function");
            });
            test('Check if return a function', () => {
                expect(typeof middleware()).toBe("function");
            });
        })
    });
};

module.exports = { testMiddleware };
