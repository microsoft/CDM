// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { LocalAdapter } from '../../../Storage';

describe('Cdm.Storage.LocalAdapter', () => {
    /**
     * Test that CreateAdapterPath returns the same result for a path with or without a leading slash.
     */
    it('TestCreateAdapterPath', () => {
        const localAdapter: LocalAdapter = new LocalAdapter('C:/some/dir');
        const pathWithLeadingSlash: string = localAdapter.createAdapterPath('/folder');
        const pathWithoutLeadingSlash: string = localAdapter.createAdapterPath('folder');

        expect(pathWithLeadingSlash)
            .toEqual('C:\\some\\dir\\folder');
        expect(pathWithLeadingSlash)
            .toEqual(pathWithoutLeadingSlash);

        // A null corpus path should return a null adapter path
        expect(localAdapter.createAdapterPath(undefined))
            .toBeUndefined();
    });
});
