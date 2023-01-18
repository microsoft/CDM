// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Stopwatch } from 'ts-stopwatch';
import {
    CdmConstants,
    CdmCorpusDefinition,
    cdmDataFormat,
    CdmDocumentDefinition,
    CdmEntityDeclarationDefinition,
    CdmEntityDefinition,
    CdmFolderDefinition,
    cdmLogCode,
    CdmManifestDefinition,
    cdmObjectType,
    CdmReferencedEntityDeclarationDefinition,
    cdmStatusLevel,
    CdmTraitReference,
    CdmTypeAttributeDefinition,
    constants,
    copyOptions,
    resolveOptions,
} from '../../../internal';
import { CdmFolder, ModelJson } from '../../../Persistence';
import {
    EntityDeclarationDefinition,
    entityDeclarationDefinitionType,
    Import,
    ManifestContent
} from '../../../Persistence/CdmFolder/types';
import { LocalEntity, Model } from '../../../Persistence/ModelJson/types';
import { LocalAdapter } from '../../../Storage';
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

    const cdmExtension: string = CdmConstants.cdmExtension;

    const modelJsonExtension: string = CdmConstants.modelJsonExtension;

    const manifestExtension: string = CdmConstants.manifestExtension;

    /**
     * Test ManifestPersistence fromData and toData and save it back to a file.
     */
    it('TestModelJsonFromAndToData', async () => {
        const cdmCorpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestModelJsonFromAndToData');
        const stopwatch: Stopwatch = new Stopwatch();

        stopwatch.start();
        const absPath: string = cdmCorpus.storage.createAbsoluteCorpusPath(
            modelJsonExtension, cdmCorpus.storage.fetchRootFolder('local'));

        const cdmManifest: CdmManifestDefinition = await cdmCorpus.createRootManifest(absPath);
        const obtainedModelJson: Model = await ModelJson.ManifestPersistence.toData(cdmManifest, undefined, undefined);
        stopwatch.stop();

        HandleOutput('TestModelJsonFromAndToData', modelJsonExtension, obtainedModelJson);

        expect(stopwatch.getTime())
            .toBeLessThan(800);
    });

    /**
     * Test loading CDM folder files and save the model.json file
     */
    it('TestLoadingCdmFolderAndModelJsonToData', async () => {
        const cdmCorpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestLoadingCdmFolderAndModelJsonToData');
        const stopwatch: Stopwatch = new Stopwatch();
        stopwatch.start();
        const cdmManifest: CdmManifestDefinition = await cdmCorpus.fetchObjectAsync<CdmManifestDefinition>(`default${manifestExtension}`, cdmCorpus.storage.fetchRootFolder('local'));
        stopwatch.stop();

        expect(stopwatch.getTime())
            .toBeLessThan(8500);
        stopwatch.reset();

        stopwatch.start();
        const obtainedModelJson: Model = await ModelJson.ManifestPersistence.toData(cdmManifest, undefined, undefined);
        stopwatch.stop();

        HandleOutput('TestLoadingCdmFolderAndModelJsonToData', modelJsonExtension, obtainedModelJson, true, true);

        expect(stopwatch.getTime())
            .toBeLessThan(8500);
    });

    /**
     * Test loading model json result files and save it as CDM folder files.
     */
    it('TestLoadingModelJsonResultAndCdmFolderToData', async () => {
        const cdmCorpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestLoadingModelJsonResultAndCdmFolderToData');
        const absPath: string = cdmCorpus.storage.createAbsoluteCorpusPath(modelJsonExtension, cdmCorpus.storage.fetchRootFolder('local'));

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

        HandleOutput('TestLoadingModelJsonResultAndCdmFolderToData', `cdmFolder${cdmExtension}`, obtainedCdmFolder);

        expect(stopwatch.getTime())
            .toBeLessThan(1500);
    });

    /**
     * Test if when loading a model.json file the foundations is imported correctly.
     */
    it('TestManifestFoundationImport', async () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestManifestFoundationImport');
        corpus.setEventCallback((statusLevel: cdmStatusLevel, message1: string) => {
            if (statusLevel >= cdmStatusLevel.error) {
                throw new Error(message1);
            }
        });
        const cdmManifest: CdmManifestDefinition =
            await corpus.fetchObjectAsync<CdmManifestDefinition>(modelJsonExtension, corpus.storage.fetchRootFolder('local'));
    });

    /**
     * Test if the imports location are relative to the root level file.
     */
    it('TestImportsRelativePath', async () => {
        // the corpus path in the imports are relative to the document where it was defined.
        // when saving in model.json the documents are flattened to the manifest level
        // so it is necessary to recalculate the path to be relative to the manifest.
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestImportsRelativePath');
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
    });

    /**
     * Test loading model.json files and save it as CDM folder files.
     */
    it('TestLoadingModelJsonAndCdmFolderToData', async () => {
        const cdmCorpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestLoadingModelJsonAndCdmFolderToData');
        const absPath: string = cdmCorpus.storage.createAbsoluteCorpusPath(modelJsonExtension, cdmCorpus.storage.fetchRootFolder('local'));
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

        HandleOutput('TestLoadingModelJsonAndCdmFolderToData', `cdmFolder${cdmExtension}`, obtainedCdmFolder);

        expect(stopwatch.getTime())
            .toBeLessThan(1000);
    });

    /**
     * Test loading CDM folder result files and save as model.json
     */
    it('TestLoadingCdmFolderResultAndModelJsonToData', async () => {
        const cdmCorpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestLoadingCdmFolderResultAndModelJsonToData');
        const absPath: string = cdmCorpus.storage.createAbsoluteCorpusPath(
            `result.model${manifestExtension}`,
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

        expect(cdmManifest.imports.item(constants.FOUNDATIONS_CORPUS_PATH, undefined, false))
            .toBeUndefined()
        expect(obtainedModelJson['cdm:imports'].length)
            .toBe(1)
        expect(obtainedModelJson['cdm:imports'][0]['corpusPath'])
            .toBe(constants.FOUNDATIONS_CORPUS_PATH)

        HandleOutput('TestLoadingCdmFolderResultAndModelJsonToData', modelJsonExtension, obtainedModelJson);

        expect(stopwatch.getTime())
            .toBeLessThan(1500);
    });

    /**
     * Tests loading Model.json and converting to CdmFolder
     */
    it('TestExtensibilityLoadingModelJsonAndCdmFolderToData', async () => {
        const cdmCorpus: CdmCorpusDefinition =
            testHelper.getLocalCorpus(testsSubpath, 'TestExtensibilityLoadingModelJsonAndCdmFolderToData');
        const absPath: string = cdmCorpus.storage.createAbsoluteCorpusPath(
            modelJsonExtension,
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

        HandleOutput('TestExtensibilityLoadingModelJsonAndCdmFolderToData', `cdmFolder${cdmExtension}`, obtainedCdmFolder);
    });

    it('TestReferenceModels', async () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestReferenceModels');

        const manifest: CdmManifestDefinition =
            await corpus.fetchObjectAsync<CdmManifestDefinition>(modelJsonExtension, corpus.storage.fetchRootFolder('local'));

        // entity with same modelId but different location
        const referenceEntity1: CdmReferencedEntityDeclarationDefinition =
            new CdmReferencedEntityDeclarationDefinition(corpus.ctx, 'ReferenceEntity1');
        referenceEntity1.entityPath = 'remote:/contoso/entity1.model.json/Entity1';
        const modelIdTrait1: CdmTraitReference = referenceEntity1.exhibitsTraits.push('is.propertyContent.multiTrait') as CdmTraitReference;
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
        const modelIdTrait3: CdmTraitReference = referenceEntity3.exhibitsTraits.push('is.propertyContent.multiTrait') as CdmTraitReference;
        modelIdTrait3.isFromProperty = true;
        modelIdTrait3.arguments.push('modelId', '3b2e040a-c8c5-4508-bb42-09952eb04a50');
        manifest.entities.push(referenceEntity3);

        // entity with same modelId and same location
        const referenceEntity4: CdmReferencedEntityDeclarationDefinition =
            new CdmReferencedEntityDeclarationDefinition(corpus.ctx, 'ReferenceEntity4');
        referenceEntity4.entityPath = 'remote:/contoso/entity.model.json/Entity4';
        const modelIdTrait4: CdmTraitReference = referenceEntity4.exhibitsTraits.push('is.propertyContent.multiTrait') as CdmTraitReference;
        modelIdTrait4.isFromProperty = true;
        modelIdTrait4.arguments.push('modelId', 'f19bbb97-c031-441a-8bd1-61b9181c0b83/1a7ef9c8-c7e8-45f8-9d8a-b80f8ffe4612');
        manifest.entities.push(referenceEntity4);

        const obtainedModelJson: Model = await ModelJson.ManifestPersistence.toData(manifest, undefined, undefined);
        HandleOutput('TestReferenceModels', modelJsonExtension, obtainedModelJson);
    });

    /**
     * Tests that a description on a CdmFolder entity sets the description on the ModelJson entity.
     */
    it('TestSettingModelJsonEntityDescription', async () => {
        const cdmCorpus: CdmCorpusDefinition = new CdmCorpusDefinition();
        cdmCorpus.setEventCallback(() => { }, cdmStatusLevel.error);
        const cdmManifest: CdmManifestDefinition = cdmCorpus.MakeObject<CdmManifestDefinition>(cdmObjectType.manifestDef, 'test');
        const document: CdmDocumentDefinition = cdmCorpus.MakeObject<CdmDocumentDefinition>(cdmObjectType.documentDef, `entity${cdmExtension}`);

        const folder: CdmFolderDefinition = cdmCorpus.storage.fetchRootFolder('local');
        folder.documents.push(document);

        const entity: CdmEntityDefinition = document.definitions.push(cdmObjectType.entityDef, 'entity') as CdmEntityDefinition;
        entity.description = 'test description';

        cdmManifest.entities.push(entity);
        folder.documents.push(cdmManifest);

        const obtainedModelJson: Model = await ModelJson.ManifestPersistence.toData(cdmManifest, undefined, undefined);

        expect(obtainedModelJson.entities[0].description)
            .toEqual('test description');
    });

    /**
     * Tests that traits that convert into annotations are properly converted on load and save
     */
    it('TestLoadingAndSavingCdmTraits', async () => {
        const cdmCorpus = testHelper.getLocalCorpus(testsSubpath, 'TestLoadingAndSavingCdmTraits');
        const manifest = await cdmCorpus.fetchObjectAsync<CdmManifestDefinition>('model.json');
        const entity = await cdmCorpus.fetchObjectAsync<CdmEntityDefinition>('someEntity.cdm.json/someEntity');
        expect(entity.exhibitsTraits.item('is.CDM.entityVersion'))
            .not.toBeUndefined();

        const manifestData = await ModelJson.ManifestPersistence.toData(manifest, new resolveOptions(manifest.inDocument), new copyOptions());
        const versionAnnotation = manifestData.entities[0]['annotations'][0];
        expect(versionAnnotation.value)
            .toBe('<version>');
    });

    /**
     * Tests that the "date" and "time" data types are correctly loaded/saved from/to a model.json.
     */
    it('TestLoadingAndSavingDateAndTimeDataTypes', async () => {
        const cdmCorpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestLoadingAndSavingDateAndTimeDataTypes');

        // Load the manifest and resolve it
        const manifest: CdmManifestDefinition = await cdmCorpus.fetchObjectAsync<CdmManifestDefinition>('local:/default.manifest.cdm.json');
        const resolvedManifest: CdmManifestDefinition = await manifest.createResolvedManifestAsync('resolved', undefined);

        // Convert loaded manifest to model.json
        const modelJson: Model = await ModelJson.ManifestPersistence.toData(resolvedManifest, undefined, undefined);

        // Verify that the attributes' data types were correctly persisted as "date" and "time"
        expect((modelJson.entities[0] as LocalEntity).attributes[0].dataType)
            .toEqual('date');
        expect((modelJson.entities[0] as LocalEntity).attributes[1].dataType)
            .toEqual('time');

        // Now check that these attributes' data types are still "date" and "time" when loading the model.json back to manifest
        // We first need to create a second adapter to the input folder to fool the OM into thinking it's different
        // This is because there's a bug that currently prevents us from saving and then loading a model.json under the same namespace
        cdmCorpus.storage.mount('local2', new LocalAdapter(testHelper.getInputFolderPath(testsSubpath, 'TestLoadingAndSavingDateAndTimeDataTypes')));

        const manifestFromModelJson: CdmManifestDefinition = await cdmCorpus.fetchObjectAsync<CdmManifestDefinition>('local2:/model.json');
        const entity: CdmEntityDefinition = await cdmCorpus.fetchObjectAsync<CdmEntityDefinition>(manifestFromModelJson.entities.allItems[0].entityPath, manifestFromModelJson);

        // Verify that the attributes' data types were correctly loaded as "date" and "time"
        expect((entity.attributes.allItems[0] as CdmTypeAttributeDefinition).dataFormat)
            .toEqual(cdmDataFormat.date);
        expect((entity.attributes.allItems[1] as CdmTypeAttributeDefinition).dataFormat)
            .toEqual(cdmDataFormat.time);
    });

    /**
     * Test model.json is correctly created without an entity when the location is not recognized
     */
    it('TestIncorrectModelLocation', async () => {
        const expectedLogs = new Set<cdmLogCode>([cdmLogCode.ErrStorageInvalidAdapterPath, cdmLogCode.ErrPersistModelJsonEntityParsingError, cdmLogCode.ErrPersistModelJsonRefEntityInvalidLocation]);
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestIncorrectModelLocation', undefined, false, expectedLogs);
        const manifest: CdmManifestDefinition = await corpus.fetchObjectAsync<CdmManifestDefinition>('model.json');
        expect(manifest)
            .not.toBeUndefined();
        expect(manifest.entities.length)
            .toBe(0);
        testHelper.expectCdmLogCodeEquality(corpus, cdmLogCode.ErrPersistModelJsonRefEntityInvalidLocation, true);
    });

    /**
     * Handles the obtained output.
     * If needed, writes the output to a test debugging file.
     * It reads expected output and compares it to the actual output.
     * @param testName The name of the test.
     * @param outputFileName The name of the output file. Used both for expected and actual output.
     * @param actualOutput The output obtained through operations, that is to be compared with the expected output.
     * @param isLanguageSpecific There is subfolder called Typescript.
     */
    function HandleOutput(testName: string, outputFileName: string, actualOutput: object, doesWriteTestDebuggingFiles?: boolean, isLanguageSpecific?: boolean): void {
        const actualOutputSerialized: string = JSON.stringify(actualOutput);
        if (doesWriteTestDebuggingFiles) {
            testHelper.writeActualOutputFileContent(testsSubpath, testName, outputFileName, actualOutputSerialized);
        }

        const expectedOutputSerialized: string = testHelper.getExpectedOutputFileContent(testsSubpath, testName, outputFileName, isLanguageSpecific);
        const expectedOutput: object = JSON.parse(expectedOutputSerialized) as object;

        testHelper.assertObjectContentEquality(expectedOutput, actualOutput);
    }
});
