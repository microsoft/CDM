// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ModelJson } from '../../../Persistence';
import { Model } from '../../../Persistence/ModelJson/types';
import { LocalAdapter } from '../../../Storage';
import {
    CdmCorpusDefinition,
    CdmManifestDefinition,
    CdmTraitReference,
    copyOptions,
    resolveOptions
} from '../../../internal';
import { testHelper } from '../../testHelper';

/**
 * 
 */
describe('Cdm/ReferencedEntityDeclarationTest', () => {
    /**
     * The path between TestDataPath and TestName.
     */
    const testsSubpath: string = 'Cdm/ReferencedEntityDeclaration';

    /**
     * Test that ReferencedEntity is correctly found with path separator as "/" or "\"
     */
    it('TestRefEntityWithSlashPath', async () => {

        const slashCorpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestRefEntityWithSlashPath');
        const slashLocalPath: string = (slashCorpus.storage.namespaceAdapters.get('local') as LocalAdapter).root;
        var slashAdapter = new LocalAdapterWithSlashPath(slashLocalPath, "/");
        slashCorpus.storage.mount("slash", slashAdapter);
        slashCorpus.storage.defaultNamespace = "slash";

        // load model.json files with paths generated using both '/' and '\'
        var slashManifest = await slashCorpus.fetchObjectAsync<CdmManifestDefinition>('slash:/model.json');

        // manually add the reference model location, path will vary on each machine
        var refModelTrait = slashManifest.exhibitsTraits.item('is.modelConversion.referenceModelMap') as CdmTraitReference;
        var entityPath = slashManifest.entities.allItems[0].entityPath;
        refModelTrait.arguments.allItems[0].value[0].location = slashAdapter.createAdapterPath(entityPath.substring(0, entityPath.lastIndexOf('/')));

        var slashModel = await ModelJson.ManifestPersistence.toData(slashManifest, new resolveOptions(), new copyOptions());

        expect(slashModel)
            .not.toBeUndefined();
        expect(slashModel.entities.length)
            .toBe(1);

        const backSlashCorpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestRefEntityWithSlashPath');
        var backSlashLocalPath = (backSlashCorpus.storage.namespaceAdapters.get('local') as LocalAdapter).root;
        var backSlashAdapter = new LocalAdapterWithSlashPath(backSlashLocalPath, '\\');
        backSlashCorpus.storage.mount('backslash', backSlashAdapter);
        backSlashCorpus.storage.defaultNamespace = 'backslash';

        var backSlashManifest = await backSlashCorpus.fetchObjectAsync<CdmManifestDefinition>('backslash:/model.json');

        // manually add the reference model location, path will vary on each machine
        var backSlashRefModelTrait = backSlashManifest.exhibitsTraits.item('is.modelConversion.referenceModelMap') as CdmTraitReference;
        var backSlashEntityPath = backSlashManifest.entities.allItems[0].entityPath;
        backSlashRefModelTrait.arguments.allItems[0].value[0].location = backSlashAdapter.createAdapterPath(backSlashEntityPath.substring(0, backSlashEntityPath.lastIndexOf('/')))
            .replace(/\//g, '\\\\');

        const backSlashModel: Model = await ModelJson.ManifestPersistence.toData(backSlashManifest, new resolveOptions(), new copyOptions());

        expect(backSlashModel)
            .not.toBeUndefined();
        expect(backSlashModel.entities.length)
            .toBe(1);
    });

    class LocalAdapterWithSlashPath extends LocalAdapter {
        private separator: string;

        constructor(root: string, separator: string) {
            super(root);
            this.separator = separator;
        }

        public createAdapterPath(corpusPath: string): string {
            const basePath: string = super.createAdapterPath(corpusPath);
            return this.separator == "/" ? basePath.replace(/\\/, '/') : basePath.replace(/\//, '\\');
        }

        public createCorpusPath(adapterPath: string): string {
            return adapterPath;
        }
    }
});