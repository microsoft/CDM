import { CdmCorpusDefinition, CdmManifestDefinition, CdmReferencedEntityDeclarationDefinition, cdmStatusLevel } from '../../../internal';
import { LocalAdapter } from '../../../Storage';
import { testHelper } from '../../testHelper';

describe('Cdm/Resolution/ManifestResolve', () => {
    const testsSubPath: string = 'Cdm/Resolution/ManifestResolve';
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
    });
});
