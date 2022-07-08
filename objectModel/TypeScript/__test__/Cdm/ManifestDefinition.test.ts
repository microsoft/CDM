// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusDefinition,
    CdmDocumentDefinition,
    CdmEntityDeclarationDefinition,
    CdmE2ERelationship,
    CdmManifestDeclarationDefinition,
    CdmManifestDefinition,
    CdmTraitReferenceBase,
    CdmFolderDefinition
} from '../../internal';
import { testHelper } from '../testHelper';

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
});
