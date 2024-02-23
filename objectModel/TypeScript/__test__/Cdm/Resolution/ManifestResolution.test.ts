// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmConstants,
    CdmCorpusDefinition,
    CdmDocumentDefinition,
    CdmEntityDefinition,
    cdmLogCode,
    CdmManifestDefinition,
    cdmObjectType,
    CdmReferencedEntityDeclarationDefinition,
    cdmStatusLevel,
    resolveOptions
} from '../../../internal';
import { LocalAdapter } from '../../../Storage';
import { testHelper } from '../../testHelper';

describe('Cdm/Resolution/ManifestResolution', () => {
    const testsSubPath: string = 'Cdm/Resolution/ManifestResolutionTest';
    const schemaDocsPath: string = testHelper.schemaDocumentsPath;

    /**
     * Test if a manifest resolves correctly a referenced entity declaration
     */
    it('TestReferencedEntityDeclarationResolution', async () => {
        const cdmCorpus: CdmCorpusDefinition = new CdmCorpusDefinition();
        cdmCorpus.storage.mount('cdm', new LocalAdapter(schemaDocsPath));
        cdmCorpus.setEventCallback(() => { }, cdmStatusLevel.error);
        cdmCorpus.storage.defaultNamespace = 'cdm';

        const manifest: CdmManifestDefinition = new CdmManifestDefinition(cdmCorpus.ctx, 'manifest');

        manifest.entities.push(
            'Account',
            'cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/Account.cdm.json/Account'
        );

        const referencedEntity: CdmReferencedEntityDeclarationDefinition =
            new CdmReferencedEntityDeclarationDefinition(cdmCorpus.ctx, 'Address');
        referencedEntity.entityPath =
            'cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/electronicMedicalRecords.manifest.cdm.json/Address';
        manifest.entities.push(referencedEntity);

        cdmCorpus.storage.fetchRootFolder('cdm').documents
            .push(manifest);

        const resolvedManifest: CdmManifestDefinition = await manifest.createResolvedManifestAsync('resolvedManifest', undefined);

        expect(resolvedManifest.entities.length)
            .toBe(2);
        expect(resolvedManifest.entities.allItems[0].entityPath)
            .toBe('core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/resolved/Account.cdm.json/Account');
        expect(resolvedManifest.entities.allItems[1].entityPath)
            .toBe('cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/electronicMedicalRecords.manifest.cdm.json/Address');
    }, 26000);

    /**
     * Test that resolving a manifest that hasn't been added to a folder doesn't throw any exceptions.
     */
    it('TestResolvingManifestNotInFolder', async () => {
        let failed: boolean = false;

        try {
            var expectedLogCodes = new Set<cdmLogCode>([cdmLogCode.ErrResolveManifestFailed]);
            const cdmCorpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubPath, 'TestResolvingManifestNotInFolder', undefined, false, expectedLogCodes, true);

            const manifest: CdmManifestDefinition = cdmCorpus.MakeObject<CdmManifestDefinition>(cdmObjectType.manifestDef, 'test');
            const entity: CdmEntityDefinition = cdmCorpus.MakeObject<CdmEntityDefinition>(cdmObjectType.entityDef, 'entity');
            const document: CdmDocumentDefinition = cdmCorpus.MakeObject<CdmDocumentDefinition>(cdmObjectType.documentDef, `entity${CdmConstants.cdmExtension}`);
            document.definitions.push(entity);

            // Don't add the document containing the entity to a folder either.
            manifest.entities.push(entity);
            await manifest.createResolvedManifestAsync('resolved', undefined);

            testHelper.expectCdmLogCodeEquality(cdmCorpus, cdmLogCode.ErrResolveManifestFailed, true);
        } catch (e) {
            failed = true;
        }

        expect(failed)
            .toBeFalsy();
    });

    /**
     * Test that saving a resolved manifest will not cause original logical entity doc to be marked dirty.
     */
    it('TestLinkedResolvedDocSavingNotDirtyingLogicalEntities', async () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubPath, 'TestLinkedResolvedDocSavingNotDirtyingLogicalEntities');

        const manifestAbstract: CdmManifestDefinition = corpus.MakeObject<CdmManifestDefinition>(cdmObjectType.manifestDef, 'default');

        manifestAbstract.imports.push('cdm:/foundations.cdm.json');
        manifestAbstract.entities.push('B', 'local:/B.cdm.json/B');
        corpus.storage.fetchRootFolder('output').documents.push(manifestAbstract);

        await manifestAbstract.createResolvedManifestAsync('default-resolved', '{n}/{n}.cdm.json');

        expect(!corpus.storage.namespaceFolders.get('local').documents.allItems[0].isDirty
            && !corpus.storage.namespaceFolders.get('local').documents.allItems[1].isDirty)
            .toBeTruthy();
    });

    /**
     * Test that correct error is shown when trying to create a resolved manifest with a name that already exists
     */
    it('TestResolvingManifestWithSameName', async () => {
        var expectedLogCodes = new Set<cdmLogCode>([cdmLogCode.ErrResolveManifestExists]);
        var corpus = testHelper.getLocalCorpus(testsSubPath, 'TestResolvingManifestWithSameName', undefined, false, expectedLogCodes);

        const manifest: CdmManifestDefinition = corpus.MakeObject<CdmManifestDefinition>(cdmObjectType.manifestDef, 'test');
        corpus.storage.namespaceFolders.get('local').documents.push(manifest);
        const resManifest: CdmManifestDefinition = await manifest.createResolvedManifestAsync(manifest.name, '{n}/{n}.cdm.json');

        expect(resManifest)
            .toBeUndefined();
        testHelper.expectCdmLogCodeEquality(corpus, cdmLogCode.ErrResolveManifestExists, true);
    });

    /**
     * Test that manifest containing entities having dependency on each other for polymorphic sources resolves.
     */
    it('TestResolveManifestWithInterdependentPolymorphicSource', async () => {
      var corpus = testHelper.getLocalCorpus(testsSubPath, 'TestResolveManifestWithInterdependentPolymorphicSource');

      const manifest: CdmManifestDefinition = await corpus.fetchObjectAsync('local:/Input.manifest.cdm.json');
      const resOpt: resolveOptions = new resolveOptions();
      resOpt.maxDepth = 3;
      const resolvedManifest: CdmManifestDefinition = await manifest.createResolvedManifestAsync('resolved', undefined, undefined, resOpt);

      expect(resolvedManifest.entities.length)
        .toBe(2);
        expect(resolvedManifest.entities.allItems[0].entityPath.toLowerCase())
            .toBe('resolved/group.cdm.json/group');
        expect(resolvedManifest.entities.allItems[1].entityPath.toLowerCase())
            .toBe('resolved/groupmember.cdm.json/groupmember');
    });
});
