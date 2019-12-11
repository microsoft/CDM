import { MockADLSAdapter } from './MockADLSAdapter';

describe('Cdm.Storage.CustomAdapter', () => {
    /**
     * Creates a custom adapter and tests whether it exists
     */
    it('TestCustomAdlsAdapter', () => {
        const adapter: MockADLSAdapter = new MockADLSAdapter();
        expect(adapter)
            .toBeDefined();
    });
});
