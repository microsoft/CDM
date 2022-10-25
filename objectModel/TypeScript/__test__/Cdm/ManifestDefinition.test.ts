// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmConstants,
    CdmCorpusDefinition,
    CdmDocumentDefinition,
    CdmEntityDeclarationDefinition,
    CdmE2ERelationship,
    CdmManifestDeclarationDefinition,
    CdmManifestDefinition,
    CdmTraitReferenceBase,
    CdmFolderDefinition,
    CdmLocalEntityDeclarationDefinition,
    CdmReferencedEntityDeclarationDefinition
} from '../../internal';
import { testHelper } from '../testHelper';
import { ModelJsonUnitTestLocalAdapter } from '../modelJsonUnitTestLocalAdapter';
import { LocalAdapter } from '../../Storage/LocalAdapter';

describe('Cdm/ManifestDefinitionTests', () => {
    const testsSubpath: string = 'Cdm/ManifestDefinition';

    /**
    * Tests if the imports on the resolved manifest are relative to the resolved manifest location.
    */
    it('testResolvedManifestImport', async () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'testResolvedManifestImport');
        // Make sure that we are not picking up the default namespace while testing.
        corpus.storage.defaultNamespace = 'remote';

        const documentName: string = 'localImport.cdm.json';
        const localFolder: CdmFolderDefinition = corpus.storage.fetchRootFolder('local');

        // Create a manifest that imports a document on the same folder.
        const manifest = new CdmManifestDefinition(corpus.ctx, 'default');
        manifest.imports.push(documentName);
        localFolder.documents.push(manifest);

        const document: CdmDocumentDefinition = new CdmDocumentDefinition(corpus.ctx, documentName);
        localFolder.documents.push(document);

        // Resolve the manifest into a different folder.
        const resolvedManifest: CdmManifestDefinition = await manifest.createResolvedManifestAsync('output:/default.manifest.cdm.json', undefined);

        // Checks if the import path on the resolved manifest points to the original location.
        expect(resolvedManifest.imports.length)
            .toBe(1);
        expect(resolvedManifest.imports.allItems[0].corpusPath)
            .toBe(`local:/${documentName}`);
    });

    /**
     * Tests if the copy function creates copies of the sub objects
     */
    it('testManifestCopy', () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus('', 'testManifestCopy', undefined, undefined, undefined, true);
        const manifest: CdmManifestDefinition = new CdmManifestDefinition(corpus.ctx, 'name');

        const entityName: string = 'entity';
        const subManifestName: string = 'subManifest';
        const relationshipName: string = 'relName';
        const traitName: string = "traitName";

        const entityDec: CdmEntityDeclarationDefinition = manifest.entities.push(entityName);
        const subManifest: CdmManifestDeclarationDefinition = manifest.subManifests.push(subManifestName);
        const relationship: CdmE2ERelationship = manifest.relationships.push(relationshipName);
        const trait: CdmTraitReferenceBase = manifest.exhibitsTraits.push(traitName);

        const copy: CdmManifestDefinition = manifest.copy() as CdmManifestDefinition;
        copy.entities.allItems[0].entityName = 'newEntity';
        copy.subManifests.allItems[0].manifestName = 'newSubManifest';
        copy.relationships.allItems[0].name = 'newRelName';
        copy.exhibitsTraits.allItems[0].namedReference = 'newTraitName';

        expect(entityDec.entityName)
            .toBe(entityName);
        expect(subManifest.manifestName)
            .toBe(subManifestName);
        expect(relationship.name)
            .toBe(relationshipName);
        expect(trait.namedReference)
            .toBe(traitName);
    });


    /**
    * Tests if FileStatusCheckAsync() works properly for manifest loaded from model.json.
    */
     it('testModelJsonManifestFileStatusCheckAsync', async () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'testModelJsonManifestFileStatusCheckAsync');
        const modeljsonAdapter: ModelJsonUnitTestLocalAdapter = new ModelJsonUnitTestLocalAdapter((corpus.storage.namespaceAdapters.get('local') as LocalAdapter).root);
        corpus.storage.mount('modeljson', modeljsonAdapter);
        corpus.storage.defaultNamespace = 'modeljson';

        const manifest : CdmManifestDefinition = await corpus.fetchObjectAsync('modeljson:/' + CdmConstants.modelJsonExtension);
        expect(manifest.isVirtual())
            .toBeTruthy();
        expect(manifest.entities.allItems[0] instanceof CdmReferencedEntityDeclarationDefinition)
            .toBeTruthy();
        expect((manifest.entities.allItems[0] as CdmReferencedEntityDeclarationDefinition).isVirtual())
            .toBeTruthy();
        expect(manifest.entities.allItems[1] instanceof CdmLocalEntityDeclarationDefinition)
            .toBeTruthy();
        expect((manifest.entities.allItems[1] as CdmLocalEntityDeclarationDefinition).isVirtual())
            .toBeTruthy();

        const timeBeforeLoad: Date = new Date();

        const oldManifestLastFileModifiedTime: Date = manifest._fileSystemModifiedTime;
        expect(manifest.lastFileStatusCheckTime)
            .toBeUndefined();
        expect(manifest.entities.allItems[0].lastFileStatusCheckTime)
            .toBeUndefined();
        expect(manifest.entities.allItems[1].lastFileStatusCheckTime)
            .toBeUndefined();
        expect(manifest.lastFileModifiedTime)
            .toBeUndefined();
        expect(manifest.entities.allItems[0].lastFileModifiedTime)
            .toBeUndefined();        
        expect(manifest.entities.allItems[1].lastFileModifiedTime)
            .toBeUndefined();      
        
        expect(oldManifestLastFileModifiedTime < timeBeforeLoad)
            .toBeTruthy();
        
        await new Promise(f => setTimeout(f, 1000));

        await manifest.fileStatusCheckAsync();

        const newManifestLastFileStatusCheckTime = manifest.lastFileStatusCheckTime;
        const newRefEntityLastFileStatusCheckTime = manifest.entities.allItems[0].lastFileStatusCheckTime;
        const newLocalEntityLastFileStatusCheckTime = manifest.entities.allItems[1].lastFileStatusCheckTime;

        expect(manifest.lastFileModifiedTime)
            .not
            .toBeUndefined();
        expect(manifest.entities.allItems[0].lastFileModifiedTime)
            .not
            .toBeUndefined();        
        expect(manifest.entities.allItems[1].lastFileModifiedTime)
            .not
            .toBeUndefined();

        expect(newManifestLastFileStatusCheckTime > timeBeforeLoad)
            .toBeTruthy();
        expect(newLocalEntityLastFileStatusCheckTime > timeBeforeLoad)
            .toBeTruthy();
        expect(newRefEntityLastFileStatusCheckTime > timeBeforeLoad)
            .toBeTruthy();
    });
});
