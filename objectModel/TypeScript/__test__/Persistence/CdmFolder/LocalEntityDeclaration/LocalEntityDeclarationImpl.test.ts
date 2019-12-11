import { readFileSync } from 'fs';
import { CdmCorpusDefinition, CdmLocalEntityDeclarationDefinition, CdmManifestDefinition, cdmObjectType, resolveContext } from '../../../../internal';
import { ManifestPersistence } from '../../../../Persistence/CdmFolder';
import { ManifestContent } from '../../../../Persistence/CdmFolder/types';
import { testHelper } from '../../../testHelper';

describe('Persistence.CdmFolder.LocalEntityDeclaration', () => {
    /// <summary>
    /// The path between TestDataPath and TestName.
    /// </summary>
    const testsSubpath: string = 'Persistence/CdmFolder/LocalEntityDeclaration';

    /**
     * Testing for folder impl instance with local entity declaration.
     * Creates Manifest using empty string as namespace.
     */
    it('TestLoadLocalEntityNoPartition', () => {
        const readFile: string = testHelper.getInputFileContent(
            testsSubpath,
            'TestLoadLocalEntityNoPartition',
            'entities.manifest.cdm.json');

        const cdmManifest: CdmManifestDefinition = CdmManifestDefinition.instanceFromData(
            new resolveContext(new CdmCorpusDefinition(), undefined), '', '', '', JSON.parse(readFile));
        expect(cdmManifest.entities.length)
            .toBe(1);
        expect(cdmManifest.entities.allItems[0].getObjectType())
            .toBe(cdmObjectType.localEntityDeclarationDef);
        const entity: CdmLocalEntityDeclarationDefinition = cdmManifest.entities.allItems[0] as CdmLocalEntityDeclarationDefinition;
        expect(entity.entityName)
            .toBe('Account');
        expect(entity.explanation)
            .toBe('Account explanation');
        expect(entity.entityPath)
            .toBe('Account.cdm.json/Account');
        expect(entity.exhibitsTraits.length)
            .toBe(1);
        expect(entity.dataPartitions.length)
            .toBe(0);
        expect(entity.dataPartitionPatterns.length)
            .toBe(0);
    });

    /**
     * Testing for folder impl instance with local entity declaration.
     * This checks the result when manifest was created with a non-null namespace. Entity Path should contain this namespace.
     */
    it('TestLoadLocalEntityNoPartitionNamespaceSet', () => {
        const readFile: string = testHelper.getInputFileContent(
            testsSubpath,
            'TestLoadLocalEntityNoPartitionnamespaceSet',
            'entities.manifest.cdm.json');

        const cdmManifest: CdmManifestDefinition = CdmManifestDefinition.instanceFromData(
            new resolveContext(new CdmCorpusDefinition(), undefined), 'testEntity', 'testNamespace', '/', JSON.parse(readFile));
        expect(cdmManifest.entities.length)
            .toBe(1);
        expect(cdmManifest.entities.allItems[0].getObjectType())
            .toBe(cdmObjectType.localEntityDeclarationDef);
        const entity: CdmLocalEntityDeclarationDefinition = cdmManifest.entities.allItems[0] as CdmLocalEntityDeclarationDefinition;
        expect(entity.entityName)
            .toBe('Account');
        expect(entity.explanation)
            .toBe('Account explanation');
        expect(entity.entityPath)
            .toBe('Account.cdm.json/Account');
        expect(entity.exhibitsTraits.length)
            .toBe(1);
        expect(entity.dataPartitions.length)
            .toBe(0);
        expect(entity.dataPartitionPatterns.length)
            .toBe(0);

        const manifestToData: ManifestContent = ManifestPersistence.toData(cdmManifest, undefined, undefined);
        expect(manifestToData.entities[0].entityPath)
            .toBe('Account.cdm.json/Account');
    });

    /**
     * Testing for folder impl instance with local entity declaration with absolute path.
     * This checks the result when manifest was created with a non-null namespace. Entity path should match what was passed into the file
     */
    it('TestLoadLocalEntityNoPartitionAbsoluteNamespaceSet', () => {
        const readFile: string = testHelper.getInputFileContent(
            testsSubpath,
            'TestLoadLocalEntityNoPartitionAbsoluteNamespaceSet',
            'entitiesWithNamespace.manifest.cdm.json');

        const cdmManifest: CdmManifestDefinition = CdmManifestDefinition.instanceFromData(
            new resolveContext(new CdmCorpusDefinition(), undefined), 'testEntity', 'testNamespace', '/', JSON.parse(readFile));
        expect(cdmManifest.entities.length)
            .toBe(1);
        expect(cdmManifest.entities.allItems[0].getObjectType())
            .toBe(cdmObjectType.localEntityDeclarationDef);
        const entity: CdmLocalEntityDeclarationDefinition = cdmManifest.entities.allItems[0] as CdmLocalEntityDeclarationDefinition;
        expect(entity.entityName)
            .toBe('Account');
        expect(entity.explanation)
            .toBe('Account explanation');
        expect(entity.entityPath)
            .toBe('testNamespace:/Account.cdm.json/Account');
        expect(entity.exhibitsTraits.length)
            .toBe(1);
        expect(entity.dataPartitions.length)
            .toBe(0);
        expect(entity.dataPartitionPatterns.length)
            .toBe(0);

        const manifestToData: ManifestContent = ManifestPersistence.toData(cdmManifest, undefined, undefined);
        expect(manifestToData.entities[0].entityPath)
            .toBe('testNamespace:/Account.cdm.json/Account');
    });
});
