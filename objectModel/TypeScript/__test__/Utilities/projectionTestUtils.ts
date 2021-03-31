import * as fs from 'fs';

import {
    AttributeResolutionDirectiveSet,
    CdmCorpusDefinition,
    CdmDataTypeReference,
    CdmDocumentDefinition,
    CdmEntityDefinition,
    CdmEntityReference,
    CdmFolderDefinition,
    cdmObjectType,
    CdmProjection,
    CdmTypeAttributeDefinition,
    resolveOptions
} from '../../internal';
import { AttributeContextUtil } from '../Cdm/Projection/AttributeContextUtil';
import { testHelper } from '../testHelper';


/**
 * Common utility methods for projection tests
 */
export class projectionTestUtils {
    /**
     * Path to foundations
     */
    public static foundationJsonPath: string = 'cdm:/foundations.cdm.json';

    /**
     * If true, will update the expected output txt files for all the tests that are ran.
     */
    private static updateExpectedOutput: boolean = false;

    /**
     * Resolves an entity
     * @param corpus The corpus
     * @param inputEntity The entity to resolve
     * @param directives The set of directives used for resolution
     */
    public static async getResolvedEntity(corpus: CdmCorpusDefinition, inputEntity: CdmEntityDefinition, directives: string[]): Promise<CdmEntityDefinition> {
        const roHashSet: Set<string> = new Set<string>();
        for (let i: number = 0; i < directives.length; i++) {
            roHashSet.add(directives[i]);
        }

        const resolvedEntityName: string = `Resolved_${inputEntity.entityName}`;

        const resOpt: resolveOptions = new resolveOptions(inputEntity.inDocument, new AttributeResolutionDirectiveSet(roHashSet));

        const resolvedFolder: CdmFolderDefinition = corpus.storage.fetchRootFolder('output');
        const resolvedEntity: CdmEntityDefinition = await inputEntity.createResolvedEntityAsync(resolvedEntityName, resOpt, resolvedFolder);

        return resolvedEntity;
    }

    /**
     * Returns a suffix that contains the file name and resolution option used
     * @param directives The set of directives used for resolution
     */
    public static getResolutionOptionNameSuffix(directives: string[]): string {
        let fileNamePrefix: string = '';

        for (let i: number = 0; i < directives.length; i++) {
            fileNamePrefix = `${fileNamePrefix}_${directives[i]}`;
        }

        if (!fileNamePrefix) {
            fileNamePrefix = '_default';
        }

        return fileNamePrefix;
    }

    /**
     * Loads an entity, resolves it, and then validates the generated attribute contexts
     */
    public static async loadEntityForResolutionOptionAndSave(corpus: CdmCorpusDefinition, testName: string, testsSubpath: string, entityName: string, directives: string[]): Promise<void> {
        const expectedOutputPath: string = testHelper.getExpectedOutputFolderPath(testsSubpath, testName);

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        expect(entity)
            .not
            .toBeUndefined();
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, directives);
        expect(resolvedEntity)
            .not
            .toBeUndefined();

        await projectionTestUtils.validateAttributeContext(directives, expectedOutputPath, entityName, resolvedEntity);
    }

    /**
     * Creates a corpus
     */
    public static getCorpus(testName: string, testsSubpath: string): CdmCorpusDefinition {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, testName);

        return corpus;
    }

    /**
     * Creates an entity
     */
    public static createEntity(corpus: CdmCorpusDefinition, localRoot: CdmFolderDefinition): CdmEntityDefinition {
        const entityName: string = 'TestEntity';
        const entity: CdmEntityDefinition = corpus.MakeObject<CdmEntityDefinition>(cdmObjectType.entityDef, entityName);

        const entityDoc: CdmDocumentDefinition = corpus.MakeObject<CdmDocumentDefinition>(cdmObjectType.documentDef, `${entityName}.cdm.json`, false);
        entityDoc.imports.push(projectionTestUtils.foundationJsonPath);
        entityDoc.definitions.push(entity);
        localRoot.documents.push(entityDoc, entityDoc.name);

        return entity;
    }

    /**
     * Creates a source entity for a projection
     */
    public static createSourceEntity(corpus: CdmCorpusDefinition, localRoot: CdmFolderDefinition): CdmEntityDefinition {
        const entityName: string = 'SourceEntity';
        const entity: CdmEntityDefinition = corpus.MakeObject<CdmEntityDefinition>(cdmObjectType.entityDef, entityName);

        const attributeName1: string = 'id';
        const attribute1: CdmTypeAttributeDefinition = corpus.MakeObject<CdmTypeAttributeDefinition>(cdmObjectType.typeAttributeDef, attributeName1);
        attribute1.dataType = corpus.MakeRef<CdmDataTypeReference>(cdmObjectType.dataTypeRef, 'string', true);
        entity.attributes.push(attribute1);

        const attributeName2: string = 'name';
        const attribute2: CdmTypeAttributeDefinition = corpus.MakeObject<CdmTypeAttributeDefinition>(cdmObjectType.typeAttributeDef, attributeName2);
        attribute2.dataType = corpus.MakeRef<CdmDataTypeReference>(cdmObjectType.dataTypeRef, 'string', true);
        entity.attributes.push(attribute2);

        const attributeName3: string = 'value';
        const attribute3: CdmTypeAttributeDefinition = corpus.MakeObject<CdmTypeAttributeDefinition>(cdmObjectType.typeAttributeDef, attributeName3);
        attribute3.dataType = corpus.MakeRef<CdmDataTypeReference>(cdmObjectType.dataTypeRef, 'integer', true);
        entity.attributes.push(attribute3);

        const attributeName4: string = 'date';
        const attribute4: CdmTypeAttributeDefinition = corpus.MakeObject<CdmTypeAttributeDefinition>(cdmObjectType.typeAttributeDef, attributeName4);
        attribute4.dataType = corpus.MakeRef<CdmDataTypeReference>(cdmObjectType.dataTypeRef, 'date', true);
        entity.attributes.push(attribute4);

        const entityDoc: CdmDocumentDefinition = corpus.MakeObject<CdmDocumentDefinition>(cdmObjectType.documentDef, `${entityName}.cdm.json`, false);
        entityDoc.imports.push(projectionTestUtils.foundationJsonPath);
        entityDoc.definitions.push(entity);
        localRoot.documents.push(entityDoc, entityDoc.name);

        return entity;
    }

    /**
     * Creates a projection
     */
    public static createProjection(corpus: CdmCorpusDefinition, localRoot: CdmFolderDefinition): CdmProjection {
        // Create an entity reference to use as the source of the projection
        const projectionSource: CdmEntityReference = corpus.MakeObject<CdmEntityReference>(cdmObjectType.entityRef, undefined);
        projectionSource.explicitReference = projectionTestUtils.createSourceEntity(corpus, localRoot);

        // Create the projection
        const projection: CdmProjection = corpus.MakeObject<CdmProjection>(cdmObjectType.projectionDef);
        projection.source = projectionSource;

        return projection;
    }

    /**
     * Validates if the attribute context of the resolved entity matches the expected output.
     * @param directives 
     * @param expectedOutputPath 
     * @param entityName 
     * @param resolvedEntity 
     */
    private static async validateAttributeContext(directives: string[], expectedOutputPath: string, entityName: string, resolvedEntity: CdmEntityDefinition): Promise<void> {
        if (!resolvedEntity.attributeContext) {
            fail('ValidateAttributeContext called with not resolved entity.');
        }

        const fileNamePrefix: string = `AttrCtx_${entityName}`;
        let expectedStringFilePath: string;
        const fileNameSuffix: string = projectionTestUtils.getResolutionOptionNameSuffix(directives);
        const defaultFileNameSuffix: string = projectionTestUtils.getResolutionOptionNameSuffix([]);

        // Get actual text
        const attrCtxUtil: AttributeContextUtil = new AttributeContextUtil();
        const actualText: string = attrCtxUtil.getAttributeContextStrings(resolvedEntity);

        if (projectionTestUtils.updateExpectedOutput) {
            expectedStringFilePath = `${expectedOutputPath}/${fileNamePrefix}${fileNameSuffix}.txt`;

            if (directives.length > 0) {
                const defaultStringFilePath: string = `${expectedOutputPath}/${fileNamePrefix}${defaultFileNameSuffix}.txt`;
                const defaultText: string = fs.readFileSync(defaultStringFilePath).toString();

                if (actualText === defaultText) {
                    if (fs.existsSync(expectedStringFilePath)) {
                        fs.unlinkSync(expectedStringFilePath);
                    }
                } else {
                    fs.writeFileSync(expectedStringFilePath, actualText);
                }
            } else {
                fs.writeFileSync(expectedStringFilePath, actualText);
            }
        } else {
            // Actual
            const actualStringFilePath: string = `${expectedOutputPath.replace('ExpectedOutput', 'ActualOutput')}/AttrCtx_${entityName}.txt`;

            // Save Actual AttrCtx_*.txt and Resolved_*.cdm.json
            fs.writeFileSync(actualStringFilePath, actualText);
            await resolvedEntity.inDocument.saveAsAsync(`Resolved_${entityName}.cdm.json`, false);

            // Expected
            const expectedFileNameSuffix: string = projectionTestUtils.getResolutionOptionNameSuffix(directives);
            let expectedStringFilePath: string = `${expectedOutputPath}/${fileNamePrefix}${expectedFileNameSuffix}.txt`;

            // If a test file doesn't exist for this set of directives, fall back to the default file.
            if (!fs.existsSync(expectedStringFilePath)) {
                expectedStringFilePath = `${expectedOutputPath}/${fileNamePrefix}${defaultFileNameSuffix}.txt`;
            }

            const expectedText: string = fs.readFileSync(expectedStringFilePath).toString();

            // Test if Actual is Equal to Expected
            expect(actualText)
                .toEqual(expectedText);
        }
    }
}
