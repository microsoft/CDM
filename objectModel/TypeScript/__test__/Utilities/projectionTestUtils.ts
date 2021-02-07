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
     * Resolves an entity
     * @param corpus The corpus
     * @param inputEntity The entity to resolve
     * @param resolutionOptions The resolution options
     * @param addResOptToName Whether to add the resolution options as part of the resolved entity name
     */
    public static async getResolvedEntity(corpus: CdmCorpusDefinition, inputEntity: CdmEntityDefinition, resolutionOptions: string[], addResOptToName: boolean = false): Promise<CdmEntityDefinition> {
        const roHashSet: Set<string> = new Set<string>();
        for (let i: number = 0; i < resolutionOptions.length; i++) {
            roHashSet.add(resolutionOptions[i]);
        }

        let resolvedEntityName: string = '';

        if (addResOptToName) {
            const fileNameSuffix: string = projectionTestUtils.getResolutionOptionNameSuffix(resolutionOptions);
            resolvedEntityName = `Resolved_${inputEntity.entityName}${fileNameSuffix}`;
        } else {
            resolvedEntityName = `Resolved_${inputEntity.entityName}`;
        }

        const ro: resolveOptions = new resolveOptions(inputEntity.inDocument, new AttributeResolutionDirectiveSet(roHashSet));

        const resolvedFolder: CdmFolderDefinition = corpus.storage.fetchRootFolder('output');
        const resolvedEntity: CdmEntityDefinition = await inputEntity.createResolvedEntityAsync(resolvedEntityName, ro, resolvedFolder);

        return resolvedEntity;
    }

    /**
     * Returns a suffix that contains the file name and resolution option used
     * @param resolutionOptions The resolution options
     */
    public static getResolutionOptionNameSuffix(resolutionOptions: string[]): string {
        let fileNamePrefix: string = '';

        for (let i: number = 0; i < resolutionOptions.length; i++) {
            fileNamePrefix = `${fileNamePrefix}_${resolutionOptions[i]}`;
        }

        if (!fileNamePrefix) {
            fileNamePrefix = '_default';
        }

        return fileNamePrefix;
    }

    /**
     * Loads an entity, resolves it, and then validates the generated attribute contexts
     */
    public static async loadEntityForResolutionOptionAndSave(corpus: CdmCorpusDefinition, testName: string, testsSubpath: string, entityName: string, resOpts: string[]): Promise<void> {
        const expectedOutputPath: string = testHelper.getExpectedOutputFolderPath(testsSubpath, testName);
        const fileNameSuffix: string = projectionTestUtils.getResolutionOptionNameSuffix(resOpts);

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, resOpts, true);
        await AttributeContextUtil.validateAttributeContext(corpus, expectedOutputPath, `${entityName}${fileNameSuffix}`, resolvedEntity);
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
}
