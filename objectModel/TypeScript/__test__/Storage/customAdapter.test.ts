// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { MockADLSAdapter } from './MockADLSAdapter';
import { LocalAdapter } from '../../Storage';

describe('Cdm.Storage.CustomAdapter', () => {
    /**
     * Creates a custom adapter and tests whether it exists
     */
    it('TestCustomAdlsAdapter', () => {
        const adapter: MockADLSAdapter = new MockADLSAdapter();
        expect(adapter)
            .toBeDefined();
    });

    const localAdapter: LocalAdapter = new LocalAdapter("C:/some/path");
        let path2: string = localAdapter.createAdapterPath("/folder");
        let path3: string = localAdapter.createAdapterPath("folder");
        expect(path2).toEqual(path3);
        expect(path2).toEqual(localAdapter.fullRoot + "\\folder");
});
