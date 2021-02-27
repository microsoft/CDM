// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmConstants,
    CdmCorpusDefinition,
    CdmDocumentDefinition,
    CdmEntityDefinition,
    CdmManifestDefinition,
    cdmObjectType,
    CdmReferencedEntityDeclarationDefinition,
    cdmStatusLevel
} from '../../../internal';
import { LocalAdapter } from '../../../Storage';
import { testHelper } from '../../testHelper';

describe('Cdm/Resolution/ManifestResolve', () => {
    const testsSubPath: string = 'Cdm/Resolution/ManifestResolve';
    const schemaDocsPath: string = testHelper.schemaDocumentsPath;

    /**
     * Test if a manifest resolves correctly a referenced entity declaration
     */
    it('TestReferencedEntityDeclarationResolution', async () => {
        // this test takes more time than jest expects tests to take
        jest.setTimeout(15000);

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

        // setting back expected test timeout.
        jest.setTimeout(10000);
    });

    /**
     * Test that resolving a manifest that hasn't been added to a folder doesn't throw any exceptions.
     */
    it('TestResolvingManifestNotInFolder', async () => {
        let failed: boolean = false;

        try {
            const cdmCorpus: CdmCorpusDefinition = new CdmCorpusDefinition();
            cdmCorpus.storage.mount('local', new LocalAdapter('C:\\path'));
            cdmCorpus.storage.defaultNamespace = 'local';
            cdmCorpus.setEventCallback((statusLevel: cdmStatusLevel, message: string) => {
                // We should see the following error message be logged. If not, fail.
                if (message.indexOf('Cannot resolve the manifest \'test\' because it has not been added to a folder') === -1) {
                    failed = true;
                }
            }, cdmStatusLevel.warning);

            const manifest: CdmManifestDefinition = cdmCorpus.MakeObject<CdmManifestDefinition>(cdmObjectType.manifestDef, 'test');
            const entity: CdmEntityDefinition = cdmCorpus.MakeObject<CdmEntityDefinition>(cdmObjectType.entityDef, 'entity');
            const document: CdmDocumentDefinition = cdmCorpus.MakeObject<CdmDocumentDefinition>(cdmObjectType.documentDef, `entity${CdmConstants.cdmExtension}`);
            document.definitions.push(entity);

            // Don't add the document containing the entity to a folder either.
            manifest.entities.push(entity);

            await manifest.createResolvedManifestAsync('resolved', undefined);
        } catch (e) {
            failed = true;
        }

        expect(failed)
            .toBeFalsy();
    });

    /**
     * 
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
});
