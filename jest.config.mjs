//jest.config.mjs
export default {
    testEnvironment: 'node',
    //Treat .js as ESM so you can use import/export in tests
    extensionToTreatAsEsm: ['.js'],
    //Dont transform NOde supports EsM natively
    transform: {},
}