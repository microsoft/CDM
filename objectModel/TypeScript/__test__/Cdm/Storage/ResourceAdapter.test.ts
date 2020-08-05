// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ResourceAdapter } from '../../../Storage';

describe('Cdm.Storage.ResourceAdapter', () => {
    /**
     * Tests if the calls to CreateCorpusPath return the expected corpus path.
     */
    it('TestCreateCorpusPath', () => {
        const adapter: ResourceAdapter = new ResourceAdapter();

        let path: string = adapter.createCorpusPath('Microsoft.CommonDataModel.ObjectModel.Resources/ODI-analogs/ODIEntity.cdm.json');
        expect(path)
            .toBe('/ODI-analogs/ODIEntity.cdm.json');

        path = adapter.createCorpusPath('Microsoft.CommonDataModel.ObjectModel.Resources/ODI-analogs/customer/ODIEntity.cdm.json');
        expect(path)
            .toBe('/ODI-analogs/customer/ODIEntity.cdm.json');

        path = adapter.createCorpusPath('Microsoft.CommonDataModel.ObjectModel.Resources/extensions/pbi.extension.cdm.json');
        expect(path)
            .toBe('/extensions/pbi.extension.cdm.json');

        path = adapter.createCorpusPath('Microsoft.CommonDataModel.ObjectModel.Resources/primitives.cdm.json');
        expect(path)
            .toBe('/primitives.cdm.json');

        path = adapter.createCorpusPath('Microsoft.CommonDataModel.ObjectModel.Resources/ODI-analogs/customer/_allImports.cdm.json');
        expect(path)
            .toBe('/ODI-analogs/customer/_allImports.cdm.json');

        // Case where the corpus adapter path is not meant to be understood by this adapter.
        path = adapter.createCorpusPath("C:/ODI-analogs/customer/_allImports.cdm.json");
        expect(path)
            .toBeUndefined();
    });

    /**
     * Tests if the calls to CreateAdapterPath return the expected adapter path.
     */
    it('TestCreateAdapterPath', () => {
        const adapter: ResourceAdapter = new ResourceAdapter();

        let path: string = adapter.createAdapterPath('/ODI-analogs/ODIEntity.cdm.json');
        expect(path)
            .toBe('Microsoft.CommonDataModel.ObjectModel.Resources/ODI-analogs/ODIEntity.cdm.json');

        path = adapter.createAdapterPath('/ODI-analogs/customer/ODIEntity.cdm.json');
        expect(path)
            .toBe('Microsoft.CommonDataModel.ObjectModel.Resources/ODI-analogs/customer/ODIEntity.cdm.json');

        path = adapter.createAdapterPath('/extensions/pbi.extension.cdm.json');
        expect(path)
            .toBe('Microsoft.CommonDataModel.ObjectModel.Resources/extensions/pbi.extension.cdm.json');

        path = adapter.createAdapterPath('/primitives.cdm.json');
        expect(path)
            .toBe('Microsoft.CommonDataModel.ObjectModel.Resources/primitives.cdm.json');
    });

    /**
     * Tests if the files from the resource adapter can be read correclty.
     */
    it('TestReadAsync', async (done) => {
        const adapter = new ResourceAdapter();

        expect(await adapter.readAsync('/ODI-analogs/ODIEntity.cdm.json'))
            .not
            .toBeNull();
        expect(await adapter.readAsync('/ODI-analogs/customer/Opportunity.cdm.json'))
            .not
            .toBeNull();
        expect(await adapter.readAsync('/extensions/pbi.extension.cdm.json'))
            .not
            .toBeNull();
        expect(await adapter.readAsync('/primitives.cdm.json'))
            .not
            .toBeNull();

        done();
})
});
