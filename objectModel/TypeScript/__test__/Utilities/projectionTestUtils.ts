import { CdmTraitReference } from 'Cdm/CdmTraitReference';
import * as fs from 'fs';

import {
    AttributeResolutionDirectiveSet,
    CdmCorpusDefinition,
    CdmDataTypeReference,
    CdmDocumentDefinition,
    CdmEntityDefinition,
    CdmEntityReference,
    CdmFolderDefinition,
    cdmLogCode,
    cdmObjectType,
    CdmProjection,
    CdmTypeAttributeDefinition,
    resolveOptions,
    CdmCollection,
    CdmAttributeGroupReference,
    CdmAttributeItem,
    CdmAttributeGroupDefinition
} from '../../internal';
import { AttributeContextUtil } from '../Cdm/Projection/AttributeContextUtil';
import { testHelper } from '../testHelper';


/**
 * Common utility methods for projection tests
 * If you want to update the expected output txt files for all the tests that are ran,
 * please set the parameter updateExpectedOutput true in the method validateAttributeContext()
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

        for (const directive of directives) {
            let shortenedDirective: string;

            switch (directive) {
                case 'normalized':
                    shortenedDirective = 'norm';
                    break;
                case 'referenceOnly':
                    shortenedDirective = 'refOnly';
                    break;
                case 'structured':
                    shortenedDirective = 'struc';
                    break;
                case 'virtual':
                    shortenedDirective = 'virt';
                    break;
                default:
                    throw 'Using unsupported directive';
            }
            fileNamePrefix = `${fileNamePrefix}_${shortenedDirective}`;
        }

        if (!fileNamePrefix) {
            fileNamePrefix = '_default';
        }

        return fileNamePrefix;
    }

    /**
     * Loads an entity, resolves it, and then validates the generated attribute contexts
     */
    public static async loadEntityForResolutionOptionAndSave(corpus: CdmCorpusDefinition, testName: string, testsSubpath: string, entityName: string, 
        directives: string[], updateExpectedOutput: boolean = false): Promise<CdmEntityDefinition> {
        const expectedOutputPath: string = testHelper.getExpectedOutputFolderPath(testsSubpath, testName);

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        expect(entity)
            .not
            .toBeUndefined();
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, directives);
        expect(resolvedEntity)
            .not
            .toBeUndefined();

        await projectionTestUtils.validateAttributeContext(directives, expectedOutputPath, entityName, resolvedEntity, updateExpectedOutput);

        return resolvedEntity;
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
     * Validates trait "has.expansionInfo.list" for array type.
     * @param attribute The type attribute
     * @param expectedAttrName The expected attribute name
     * @param ordinal The expected ordinal
     * @param expansionName The expected expansion name
     * @param memberAttribute The expected member attribute name
     * @internal
     */
    public static validateExpansionInfoTrait(attribute: CdmTypeAttributeDefinition, expectedAttrName: string, ordinal: number, expansionName: string, memberAttribute: string) {
        expect(attribute.name)
            .toEqual(expectedAttrName);
        const trait: CdmTraitReference = attribute.appliedTraits.item('has.expansionInfo.list') as CdmTraitReference;
        expect(trait)
            .not    
            .toBeUndefined();
        expect(trait.arguments.fetchValue('expansionName'))
            .toEqual(expansionName);
        expect(trait.arguments.fetchValue('ordinal'))
            .toEqual(ordinal.toString());
        expect(trait.arguments.fetchValue('memberAttribute'))
            .toEqual(memberAttribute);
    }

    /**
     * Validates the creation of an attribute group and return its definition
     * @param attributes The collection of attributes
     * @param attributeGroupName The attribute group name
     * @param attributesSize The expected size of the attributes collection
     * @internal
     */
    public static validateAttributeGroup(attributes: CdmCollection<CdmAttributeItem>, attributeGroupName: string, attributesSize: number = 1, index: number = 0)  {
        expect(attributes.length)
            .toEqual(attributesSize);
        expect(attributes.allItems[index].objectType)
            .toEqual(cdmObjectType.attributeGroupRef);
        const attGroupReference: CdmAttributeGroupReference = attributes.allItems[index] as CdmAttributeGroupReference;
        expect(attGroupReference.explicitReference)
            .not
            .toBeUndefined();

        const attGroupDefinition: CdmAttributeGroupDefinition = attGroupReference.explicitReference as CdmAttributeGroupDefinition;
        expect(attGroupDefinition.attributeGroupName)
            .toEqual(attributeGroupName);

        return attGroupDefinition;
    }

    /**
     * Validates if the attribute context of the resolved entity matches the expected output.
     * @param directives 
     * @param expectedOutputPath 
     * @param entityName 
     * @param resolvedEntity 
     * @param updateExpectedOutput If true, will update the expected output txt files for all the tests that are ran.
     */
    private static async validateAttributeContext(directives: string[], expectedOutputPath: string, entityName: string, resolvedEntity: CdmEntityDefinition, updateExpectedOutput: boolean = false): Promise<void> {
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

        if (updateExpectedOutput) {
            expectedStringFilePath = `${expectedOutputPath}/${fileNamePrefix}${fileNameSuffix}.txt`;

            if (directives.length > 0) {
                const defaultStringFilePath: string = `${expectedOutputPath}/${fileNamePrefix}${defaultFileNameSuffix}.txt`;
                const defaultText: string = fs.existsSync(defaultStringFilePath) ? fs.readFileSync(defaultStringFilePath).toString() : undefined;

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
            const actualStringFilePath: string = `${expectedOutputPath.replace('ExpectedOutput', testHelper.getTestActualOutputFolderName())}/AttrCtx_${entityName}.txt`;

            // Save Actual AttrCtx_*.txt and Resolved_*.cdm.json
            fs.writeFileSync(actualStringFilePath, actualText);
            await resolvedEntity.inDocument.saveAsAsync(`Resolved_${resolvedEntity.entityName}${fileNameSuffix}.cdm.json`, false);

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
