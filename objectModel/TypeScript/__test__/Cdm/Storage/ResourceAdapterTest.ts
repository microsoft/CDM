// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ResourceAdapter } from '../../../Storage';

describe('Cdm.Storage.ResourceAdapter', () => {
    it('TestCreateCorpusPath', () => {
        const adapter: ResourceAdapter = new ResourceAdapter();

        let path: string = adapter.createCorpusPath('Microsoft.CommonDataModel.ObjectModel.Resources.ODI_analogs.ODIEntity.cdm.json');
        expect('/ODI-analogs/ODIEntity.cdm.json')
            .toBe(path);

        path = adapter.createCorpusPath('Microsoft.CommonDataModel.ObjectModel.Resources.ODI_analogs.customer.ODIEntity.cdm.json');
        expect('/ODI-analogs/customer/ODIEntity.cdm.json')
            .toBe(path);

        path = adapter.createCorpusPath('Microsoft.CommonDataModel.ObjectModel.Resources.extensions.pbi.extension.cdm.json');
        expect('/extensions/pbi.extension.cdm.json')
            .toBe(path);

        path = adapter.createCorpusPath('Microsoft.CommonDataModel.ObjectModel.Resources.primitives.cdm.json');
        expect('/primitives.cdm.json')
            .toBe(path);

        path = adapter.createCorpusPath('Microsoft.CommonDataModel.ObjectModel.Resources.ODI_analogs.customer._allImports.cdm.json');
        expect('/ODI-analogs/customer/_allImports.cdm.json')
            .toBe(path);
    });

    it('TestCreateAdapterPath', () => {
        const adapter: ResourceAdapter = new ResourceAdapter();

        let path: string = adapter.createAdapterPath('/ODI-analogs/ODIEntity.cdm.json');
        expect('Microsoft.CommonDataModel.ObjectModel.Resources.ODI_analogs.ODIEntity.cdm.json')
            .toBe(path);

        path = adapter.createAdapterPath('/ODI-analogs/customer/ODIEntity.cdm.json');
        expect('Microsoft.CommonDataModel.ObjectModel.Resources.ODI_analogs.customer.ODIEntity.cdm.json')
            .toBe(path);

        path = adapter.createAdapterPath('/extensions/pbi.extension.cdm.json');
        expect('Microsoft.CommonDataModel.ObjectModel.Resources.extensions.pbi.extension.cdm.json')
            .toBe(path);

        path = adapter.createAdapterPath('/primitives.cdm.json');
        expect('Microsoft.CommonDataModel.ObjectModel.Resources.primitives.cdm.json')
            .toBe(path);
    });
});
