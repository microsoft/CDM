// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { StorageUtils } from '../../Utilities/StorageUtils';

/**
 * Test to validate StorageUtils functions
 */
describe('Utilities.StorageUtilsTest', () => {
    /**
     * Test splitNamespacePath function on different paths
     */
    it('TestSplitNamespacePath', () => {
        expect(StorageUtils.splitNamespacePath(undefined))
            .toBeUndefined();

        const pathTuple1: [string, string] = StorageUtils.splitNamespacePath('local:/some/path');
        expect(pathTuple1)
            .toBeTruthy();
        expect(pathTuple1[0])
            .toEqual('local');
        expect(pathTuple1[1])
            .toEqual('/some/path');

        const pathTuple2: [string, string] = StorageUtils.splitNamespacePath('/some/path');
        expect(pathTuple2)
            .toBeTruthy();
        expect(pathTuple2[0])
            .toEqual('');
        expect(pathTuple2[1])
            .toEqual('/some/path');

        const pathTuple3: [string, string] = StorageUtils.splitNamespacePath('adls:/some/path:with:colons');
        expect(pathTuple3)
            .toBeTruthy();
        expect(pathTuple3[0])
            .toEqual('adls');
        expect(pathTuple3[1])
            .toEqual('/some/path:with:colons');
    });
});
