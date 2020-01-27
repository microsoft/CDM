import { Stopwatch } from 'ts-stopwatch';
import {
    CdmCorpusDefinition,
    CdmDocumentDefinition,
    CdmEntityDeclarationDefinition,
    CdmFolderDefinition,
    CdmManifestDefinition,
    CdmReferencedEntityDeclarationDefinition,
    cdmStatusLevel,
    CdmTraitReference
} from '../../../internal';
import { CdmFolder, ModelJson } from '../../../Persistence';
import {
    EntityDeclarationDefinition,
    entityDeclarationDefinitionType,
    Import,
    ManifestContent
} from '../../../Persistence/CdmFolder/types';
import { Model } from '../../../Persistence/ModelJson/types';
import { testHelper } from '../../testHelper';

/**
 * The model json tests.
 */
// tslint:disable-next-line: max-func-body-length
describe('Persistence.ModelJson.ModelJson', () => {

    /**
     * Test path between TestDataPath and TestName.
     */
    const testsSubpath: string = 'Persistence/ModelJson/ModelJson';

    const doesWriteTestDebuggingFiles: boolean = testHelper.doesWriteTestDebuggingFiles;

    /**
     * Test ManifestPersistence fromData and toData and save it back to a file.
     */
    it('TestFromAndToData', async () => {
        const testInputPath: string = testHelper.getInputFolderPath(testsSubpath, 'TestFromAndToData');
        const cdmCorpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testInputPath);
        const stopwatch: Stopwatch = new Stopwatch();

        stopwatch.start();
        const absPath: string = cdmCorpus.storage.createAbsoluteCorpusPath(
            'model.json', cdmCorpus.storage.fetchRootFolder('local'));

        const cdmManifest: CdmManifestDefinition = await cdmCorpus.createRootManifest(absPath);
        const obtainedModelJson: Model = await ModelJson.ManifestPersistence.toData(cdmManifest, undefined, undefined);
        stopwatch.stop();

        HandleOutput('TestFromAndToData', 'model.json', obtainedModelJson);

        expect(stopwatch.getTime())
            .toBeLessThan(800);
    });

    /**
     * Test loading CDM folder files and save the model.json file
     */
    it('TestLoadingCdmFolderAndSavingModelJson', async () => {
        const testInputPath: string = testHelper.getInputFolderPath(testsSubpath, 'TestLoadingCdmFolderAndSavingModelJson');
        const cdmCorpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testInputPath);
        const absPath: string =
            cdmCorpus.storage.createAbsoluteCorpusPath('default.manifest.cdm.json', cdmCorpus.storage.fetchRootFolder('local'));
        const stopwatch: Stopwatch = new Stopwatch();
        stopwatch.start();
        const cdmManifest: CdmManifestDefinition = await cdmCorpus.createRootManifest(absPath);
        stopwatch.stop();

        expect(stopwatch.getTime())
            .toBeLessThan(5000);
        stopwatch.reset();

        stopwatch.start();
        const obtainedModelJson: Model = await ModelJson.ManifestPersistence.toData(cdmManifest, undefined, undefined);
        stopwatch.stop();

        HandleOutput('TestLoadingCdmFolderAndSavingModelJson', 'model.json', obtainedModelJson);

        expect(stopwatch.getTime())
            .toBeLessThan(5000);
    });

    /**
     * Test loading model json result files and save it as CDM folder files.
     */
    it('TestLoadingModelJsonResultAndSavingCdmFolder', async () => {
        const testInputPath: string = testHelper.getInputFolderPath(testsSubpath, 'TestLoadingModelJsonResultAndSavingCdmFolder');
        const cdmCorpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testInputPath);
        const absPath: string = cdmCorpus.storage.createAbsoluteCorpusPath('model.json', cdmCorpus.storage.fetchRootFolder('local'));

        const stopwatch: Stopwatch = new Stopwatch();

        stopwatch.start();
        const cdmManifest: CdmManifestDefinition = await cdmCorpus.createRootManifest(absPath);
        stopwatch.stop();

        expect(stopwatch.getTime())
            .toBeLessThan(1500);

        stopwatch.reset();

        stopwatch.start();
        const obtainedCdmFolder: ManifestContent = CdmFolder.ManifestPersistence.toData(cdmManifest, undefined, undefined);
        stopwatch.stop();

        HandleOutput('TestLoadingModelJsonResultAndSavingCdmFolder', 'cdmFolder.json', obtainedCdmFolder);

        expect(stopwatch.getTime())
            .toBeLessThan(1500);
    });

    /**
     * Test if when loading a model.json file the foundations is imported correctly.
     */
    it('TestManifestFoundationImport', async (done) => {
        const testInputPath: string = testHelper.getInputFolderPath(testsSubpath, 'TestManifestFoundationImport');
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testInputPath);
        corpus.setEventCallback((statusLevel: cdmStatusLevel, message1: string) => {
            if (statusLevel >= cdmStatusLevel.error) {
                throw new Error(message1);
            }
        });
        const cdmManifest: CdmManifestDefinition =
            await corpus.fetchObjectAsync<CdmManifestDefinition>('model.json', corpus.storage.fetchRootFolder('local'));
        done();
    });

    /**
     * Test if the imports location are relative to the root level file.
     */
    it('TestImportsRelativePath', async (done) => {
        // the corpus path in the imports are relative to the document where it was defined.
        // when saving in model.json the documents are flattened to the manifest level
        // so it is necessary to recalculate the path to be relative to the manifest.
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus('notImportantLocation');
        const folder: CdmFolderDefinition = corpus.storage.fetchRootFolder('local');

        const manifest: CdmManifestDefinition = new CdmManifestDefinition(corpus.ctx, 'manifest');
        const entityDeclaration: CdmEntityDeclarationDefinition =
            manifest.entities.push('EntityName', 'EntityName/EntityName.cdm.json/EntityName');
        folder.documents.push(manifest);

        const entityFolder: CdmFolderDefinition = folder.childFolders.push('EntityName');

        const document: CdmDocumentDefinition = new CdmDocumentDefinition(corpus.ctx, 'EntityName.cdm.json');
        document.imports.push('subfolder/EntityName.cdm.json');
        document.definitions.push('EntityName');
        entityFolder.documents.push(document);

        const subFolder: CdmFolderDefinition = entityFolder.childFolders.push('subfolder');
        subFolder.documents.push('EntityName.cdm.json');

        corpus.storage.fetchRootFolder('remote').documents
            .push(manifest);

        const data: Model = await ModelJson.ManifestPersistence.toData(manifest, undefined, undefined);

        expect(data.entities.length)
            .toBe(1);
        const imports: Import[] = data.entities[0]['cdm:imports'] as Import[];
        expect(imports.length)
            .toBe(1);
        expect(imports[0].corpusPath)
            .toBe('EntityName/subfolder/EntityName.cdm.json');
        done();
    });

    /**
     * Test loading model.json files and save it as CDM folder files.
     */
    it('TestLoadingModelJsonAndSavingCdmFolder', async () => {
        const testInputPath: string = testHelper.getInputFolderPath(testsSubpath, 'TestLoadingModelJsonAndSavingCdmFolder');

        const cdmCorpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testInputPath);
        const absPath: string = cdmCorpus.storage.createAbsoluteCorpusPath('model.json', cdmCorpus.storage.fetchRootFolder('local'));
        const stopwatch: Stopwatch = new Stopwatch();

        stopwatch.start();
        const cdmManifest: CdmManifestDefinition = await cdmCorpus.createRootManifest(absPath);
        stopwatch.stop();

        expect(stopwatch.getTime())
            .toBeLessThan(1000);

        stopwatch.reset();

        stopwatch.start();
        const obtainedCdmFolder: ManifestContent = CdmFolder.ManifestPersistence.toData(cdmManifest, undefined, undefined);
        stopwatch.stop();

        HandleOutput('TestLoadingModelJsonAndSavingCdmFolder', 'cdmFolder.json', obtainedCdmFolder);

        expect(stopwatch.getTime())
            .toBeLessThan(1000);
    });

    /**
     * Test loading CDM folder result files and save as model.json
     */
    it('TestLoadingCdmFolderResultAndSavingModelJson', async () => {
        const testInputPath: string = testHelper.getInputFolderPath(testsSubpath, 'TestLoadingCdmFolderResultAndSavingModelJson');

        const cdmCorpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testInputPath);
        const absPath: string = cdmCorpus.storage.createAbsoluteCorpusPath(
            'result.model.manifest.cdm.json',
            cdmCorpus.storage.fetchRootFolder('local')
        );
        const stopwatch: Stopwatch = new Stopwatch();

        stopwatch.start();
        const cdmManifest: CdmManifestDefinition = await cdmCorpus.createRootManifest(absPath);
        stopwatch.stop();

        expect(stopwatch.getTime())
            .toBeLessThan(1500);

        stopwatch.reset();

        stopwatch.start();
        const obtainedModelJson: Model = await ModelJson.ManifestPersistence.toData(cdmManifest, undefined, undefined);
        stopwatch.stop();

        HandleOutput('TestLoadingCdmFolderResultAndSavingModelJson', 'model.json', obtainedModelJson);

        expect(stopwatch.getTime())
            .toBeLessThan(1500);
    });

    /**
     * Tests loading Model.json and converting to CdmFolder
     */
    it('TestExtensibilityLoadingModelJsonAndSavingCdmFolder', async () => {
        const testInputPath: string = testHelper.getInputFolderPath(testsSubpath, 'TestExtensibilityLoadingModelJsonAndSavingCdmFolder');
        const cdmCorpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testInputPath);
        const absPath: string = cdmCorpus.storage.createAbsoluteCorpusPath(
            'model.json',
            cdmCorpus.storage.fetchRootFolder('local')
        );
        const cdmManifest: CdmManifestDefinition = await cdmCorpus.createRootManifest(absPath);

        const obtainedCdmFolder: ManifestContent = CdmFolder.ManifestPersistence.toData(cdmManifest, undefined, undefined);

        // For EntityReferences, entityPath contains a GUID that will not match the snapshot.
        for (const entity of obtainedCdmFolder.entities) {
            if (entity.type === entityDeclarationDefinitionType.referencedEntity) {
                entity.entityPath = undefined;
            }
        }

        /**
         * entityDeclaration contains a GUID that will not match the snapshot.
         */
        obtainedCdmFolder.entities.forEach((entity: EntityDeclarationDefinition) => {
            // tslint:disable-next-line: no-string-literal
            if (entity['entityDeclaration']) {
                // tslint:disable-next-line: no-string-literal
                entity['entityDeclaration'] = undefined;
            }
        });

        HandleOutput('TestExtensibilityLoadingModelJsonAndSavingCdmFolder', 'cdmFolder.json', obtainedCdmFolder);
    });

    it('TestReferenceModels', async () => {
        const testInputPath: string = testHelper.getInputFolderPath(testsSubpath, 'TestReferenceModels');
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testInputPath);

        const manifest: CdmManifestDefinition =
            await corpus.fetchObjectAsync<CdmManifestDefinition>('model.json', corpus.storage.fetchRootFolder('local'));

        // entity with same modelId but different location
        const referenceEntity1: CdmReferencedEntityDeclarationDefinition = 
            new CdmReferencedEntityDeclarationDefinition(corpus.ctx, 'ReferenceEntity1');
        referenceEntity1.entityPath = 'remote:/contoso/entity1.model.json/Entity1';
        const modelIdTrait1: CdmTraitReference = referenceEntity1.exhibitsTraits.push('is.propertyContent.multiTrait');
        modelIdTrait1.isFromProperty = true;
        modelIdTrait1.arguments.push('modelId', 'f19bbb97-c031-441a-8bd1-61b9181c0b83/1a7ef9c8-c7e8-45f8-9d8a-b80f8ffe4612');
        manifest.entities.push(referenceEntity1);

        // entity without modelId but same location
        const referenceEntity2: CdmReferencedEntityDeclarationDefinition =
            new CdmReferencedEntityDeclarationDefinition(corpus.ctx, 'ReferenceEntity2');
        referenceEntity2.entityPath = 'remote:/contoso/entity.model.json/Entity2';
        manifest.entities.push(referenceEntity2);

        // entity with modelId and new location
        const referenceEntity3: CdmReferencedEntityDeclarationDefinition =
            new CdmReferencedEntityDeclarationDefinition(corpus.ctx, 'ReferenceEntity3');
        referenceEntity3.entityPath = 'remote:/contoso/entity3.model.json/Entity3';
        const modelIdTrait3: CdmTraitReference = referenceEntity3.exhibitsTraits.push('is.propertyContent.multiTrait');
        modelIdTrait3.isFromProperty = true;
        modelIdTrait3.arguments.push('modelId', '3b2e040a-c8c5-4508-bb42-09952eb04a50');
        manifest.entities.push(referenceEntity3);

        // entity with same modelId and same location
        const referenceEntity4: CdmReferencedEntityDeclarationDefinition =
            new CdmReferencedEntityDeclarationDefinition(corpus.ctx, 'ReferenceEntity4');
        referenceEntity4.entityPath = 'remote:/contoso/entity.model.json/Entity4';
        const modelIdTrait4: CdmTraitReference = referenceEntity4.exhibitsTraits.push('is.propertyContent.multiTrait');
        modelIdTrait4.isFromProperty = true;
        modelIdTrait4.arguments.push('modelId', 'f19bbb97-c031-441a-8bd1-61b9181c0b83/1a7ef9c8-c7e8-45f8-9d8a-b80f8ffe4612');
        manifest.entities.push(referenceEntity4);

        const obtainedModelJson: Model = await ModelJson.ManifestPersistence.toData(manifest, undefined, undefined);
        HandleOutput('TestReferenceModels', 'model.json', obtainedModelJson);
    });

    /**
     * Handles the obtained output.
     * If needed, writes the output to a test debugging file.
     * It reads expected output and compares it to the actual output.
     * @param testName The name of the test.
     * @param outputFileName The name of the output file. Used both for expected and actual output.
     * @param actualOutput The output obtained through operations, that is to be compared with the expected output.
     */
    function HandleOutput(testName: string, outputFileName: string, actualOutput: object): void {
        const actualOutputSerialized: string = JSON.stringify(actualOutput);
        if (doesWriteTestDebuggingFiles) {
            testHelper.writeActualOutputFileContent(testsSubpath, testName, outputFileName, actualOutputSerialized);
        }

        const expectedOutputSerialized: string = testHelper.getExpectedOutputFileContent(testsSubpath, testName, outputFileName);
        const expectedOutput: object = JSON.parse(expectedOutputSerialized) as object;

        testHelper.assertObjectContentEquality(expectedOutput, actualOutput);
    }
});
