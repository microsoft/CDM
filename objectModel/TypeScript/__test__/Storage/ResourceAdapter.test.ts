// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ResourceAdapter } from '../../Storage';

describe('Cdm.Storage.ResourceAdapter', () => {
    /**
     * Tests if the calls to CreateCorpusPath return the expected corpus path.
     */
    it('TestCreateCorpusPath', () => {
        const adapter: ResourceAdapter = new ResourceAdapter();

        let path: string = adapter.createCorpusPath('Microsoft.CommonDataModel.ObjectModel.Resources/extensions/pbi.extension.cdm.json');
        expect(path)
            .toBe('/extensions/pbi.extension.cdm.json');

        path = adapter.createCorpusPath('Microsoft.CommonDataModel.ObjectModel.Resources/primitives.cdm.json');
        expect(path)
            .toBe('/primitives.cdm.json');
    });

    /**
     * Tests if the calls to CreateAdapterPath return the expected adapter path.
     */
    it('TestCreateAdapterPath', () => {
        const adapter: ResourceAdapter = new ResourceAdapter();

        let path: string = adapter.createAdapterPath('/extensions/pbi.extension.cdm.json');
        expect(path)
            .toBe('Microsoft.CommonDataModel.ObjectModel.Resources/extensions/pbi.extension.cdm.json');

        path = adapter.createAdapterPath('/primitives.cdm.json');
        expect(path)
            .toBe('Microsoft.CommonDataModel.ObjectModel.Resources/primitives.cdm.json');
    });

    /**
     * Tests if the files from the resource adapter can be read correctly.
     */
    it('TestReadAsync', async (done) => {
        const adapter = new ResourceAdapter();

        expect(await adapter.readAsync('/extensions/pbi.extension.cdm.json'))
            .not
            .toBeNull();
        expect(await adapter.readAsync('/primitives.cdm.json'))
            .not
            .toBeNull();

        done();
    });
});
