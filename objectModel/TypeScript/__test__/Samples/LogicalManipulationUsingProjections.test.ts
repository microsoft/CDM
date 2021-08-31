// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    AttributeResolutionDirectiveSet,
    CdmCorpusContext,
    CdmCorpusDefinition,
    CdmDataTypeReference,
    CdmDocumentDefinition,
    CdmEntityAttributeDefinition,
    CdmEntityDefinition,
    CdmEntityReference,
    CdmFolderDefinition,
    CdmOperationAddAttributeGroup,
    CdmOperationAddCountAttribute,
    CdmOperationArrayExpansion,
    CdmOperationRenameAttributes,
    CdmOperationReplaceAsForeignKey,
    CdmProjection,
    CdmTypeAttributeDefinition,
    resolveOptions
} from '../../internal';
import {
    LocalAdapter
} from '../../Storage';
import { testHelper } from '../testHelper';

describe('Samples.LogicalManipulationUsingProjections', () => {
    const testsSubpath: string = 'Samples';
    const testName: string = 'TestLogicalManipulationUsingProjections';

    const sampleIt: jest.It = process.env['SAMPLE_RUNTESTS'] ? it : it.skip;

    sampleIt('TestLogicalManipulationUsingProjections', async (done) => {
        jest.setTimeout(100000);
        testHelper.deleteFilesFromActualOutput(testHelper.getActualOutputFolderPath(testsSubpath, testName));

        const corpus: CdmCorpusDefinition = setupCdmCorpus();
        await logicalManipulationUsingProjections(corpus);
        testHelper.assertFolderFilesEquality(
            testHelper.getExpectedOutputFolderPath(testsSubpath, testName), 
            testHelper.getActualOutputFolderPath(testsSubpath, testName), true);
        
        done();
    });

    function setupCdmCorpus(): CdmCorpusDefinition {
        const corpus: CdmCorpusDefinition = new CdmCorpusDefinition();
        corpus.storage.defaultNamespace = 'local';
        corpus.storage.mount('cdm', new LocalAdapter(testHelper.sampleSchemaFolderPath));
        corpus.storage.mount('local', new LocalAdapter(
            testHelper.getInputFolderPath(
                testsSubpath,
                testName)));
        corpus.storage.mount('output', new LocalAdapter(
            testHelper.getActualOutputFolderPath(
                testsSubpath,
                testName)));

        return corpus;
    }

    /**
     * Applies the replaceAsForeignKey and addAttributeGroup operations to the entity attribute provided.
     * @param name entityAttr
     * @param name fkAttrName
     * @param name attrGroupName
     */
    function applyDefaultBehavior(entityAttr: CdmEntityAttributeDefinition, fkAttrName: string, attrGroupName: string) {
        const ctx = entityAttr.ctx;
        const projection = new CdmProjection(ctx);
        // Link for the Source property documentation.
        // https://docs.microsoft.com/en-us/common-data-model/sdk/convert-logical-entities-resolved-entities#source
        projection.source = entityAttr.entity;
        // Link for the RunSequentially property documentation.
        // https://docs.microsoft.com/en-us/common-data-model/sdk/convert-logical-entities-resolved-entities#run-sequentially
        projection.runSequentially = true;
        entityAttr.entity = new CdmEntityReference(ctx, projection, false);

        if (fkAttrName) {
            const foreignKeyAttr = new CdmTypeAttributeDefinition(ctx, fkAttrName);
            foreignKeyAttr.dataType = new CdmDataTypeReference(ctx, 'entityId', true);

            // Link for the ReplaceAsForeignKey operation documentation.
            // https://docs.microsoft.com/en-us/common-data-model/sdk/projections/replaceasforeignkey
            const replaceAsFKOperation = new CdmOperationReplaceAsForeignKey(ctx);
            replaceAsFKOperation.condition = 'referenceOnly';
            replaceAsFKOperation.reference = 'addressLine';
            replaceAsFKOperation.replaceWith = foreignKeyAttr;
            projection.operations.push(replaceAsFKOperation);
        }

        if (attrGroupName) {
            // Link for the AddAttributeGroup operation documentation.
            // https://docs.microsoft.com/en-us/common-data-model/sdk/projections/addattributegroup
            const addAttrGroupOperation = new CdmOperationAddAttributeGroup(ctx);
            addAttrGroupOperation.condition = 'structured';
            addAttrGroupOperation.attributeGroupName = attrGroupName;
            projection.operations.push(addAttrGroupOperation);
        }
    }

    /**
     * Applies the arrayExpansion operation to the entity attribute provided.
     * It also takes care of applying a renameAttributes operation and optionally applying a addCountAttribute operation.
     * @param name entityAttr
     * @param name startOrdinal
     * @param name endOrdinal
     * @param name renameFormat
     * @param name countAttName
     */
    function applyArrayExpansion(entityAttr: CdmEntityAttributeDefinition, startOrdinal: number, endOrdinal: number, renameFormat: string, countAttName?: string) {
        const ctx: CdmCorpusContext = entityAttr.ctx;
        const projection = new CdmProjection(ctx);
        projection.source = entityAttr.entity;
        projection.runSequentially = true;
        // Link for the Condition property documentation.
        // https://docs.microsoft.com/en-us/common-data-model/sdk/convert-logical-entities-resolved-entities#condition
        projection.condition = '!normalized';

        entityAttr.entity = new CdmEntityReference(ctx, projection, false);

        // Link for the ArrayExpansion operation documentation.
        // https://docs.microsoft.com/en-us/common-data-model/sdk/projections/arrayexpansion
        const arrExpansionOperation = new CdmOperationArrayExpansion(ctx);
        arrExpansionOperation.startOrdinal = startOrdinal;
        arrExpansionOperation.endOrdinal = endOrdinal;
        projection.operations.push(arrExpansionOperation);

        // Link for the RenameAttributes operation documentation.
        // https://docs.microsoft.com/en-us/common-data-model/sdk/projections/renameattributes
        const renameAttrsOperation = new CdmOperationRenameAttributes(ctx);
        renameAttrsOperation.renameFormat = renameFormat;
        projection.operations.push(renameAttrsOperation);

        if (countAttName) {
            const countAttribute = new CdmTypeAttributeDefinition(ctx, countAttName);
            countAttribute.dataType = new CdmDataTypeReference(ctx, 'integer', true);

            // Link for the AddCountAttribute operation documentation.
            // https://docs.microsoft.com/en-us/common-data-model/sdk/projections/addcountattribute 
            const addCountAttrOperation = new CdmOperationAddCountAttribute(ctx);
            addCountAttrOperation.countAttribute = countAttribute;
            projection.operations.push(addCountAttrOperation);
        }
    }

    async function logicalManipulationUsingProjections(corpus: CdmCorpusDefinition): Promise<void> {
        console.log('Create logical entity definition.');

        const logicalFolder = await corpus.fetchObjectAsync<CdmFolderDefinition>('output:/');
        
        const logicalDoc: CdmDocumentDefinition = logicalFolder.documents.push('Person.cdm.json');
        logicalDoc.imports.push('local:/Address.cdm.json');

        const entity = logicalDoc.definitions.push('Person') as CdmEntityDefinition;

        // Add 'name' data typed attribute.
        const nameAttr = entity.attributes.push('name') as CdmTypeAttributeDefinition;
        nameAttr.dataType = new CdmDataTypeReference(corpus.ctx, 'string', true);

        // Add 'age' data typed attribute.
        const ageAttr = entity.attributes.push('age') as CdmTypeAttributeDefinition;
        ageAttr.dataType = new CdmDataTypeReference(corpus.ctx, 'string', true);

        // Add 'address' entity typed attribute.
        const entityAttr = new CdmEntityAttributeDefinition(corpus.ctx, 'address');
        entityAttr.entity = new CdmEntityReference(corpus.ctx, 'Address', true);
        applyArrayExpansion(entityAttr, 1, 3, '{m}{A}{o}', 'countAttribute');
        applyDefaultBehavior(entityAttr, 'addressFK', 'address');

        entity.attributes.push(entityAttr);

        // Add 'email' data typed attribute.
        const emailAttr = entity.attributes.push('email') as CdmTypeAttributeDefinition;
        emailAttr.dataType = new CdmDataTypeReference(corpus.ctx, 'string', true);

        // Save the logical definition of Person.
        await entity.inDocument.saveAsAsync('Person.cdm.json');

        console.log('Get \'resolved\' folder where the resolved entities will be saved.');

        const resolvedFolder = await corpus.fetchObjectAsync<CdmFolderDefinition>('output:/');

        const resOpt = new resolveOptions(entity);

        // To get more information about directives and their meaning refer to 
        // https://docs.microsoft.com/en-us/common-data-model/sdk/convert-logical-entities-resolved-entities#directives-guidance-and-the-resulting-resolved-shapes

        // We will start by resolving this entity with the 'normalized' direcitve. 
        // This directive will be used on this and the next two examples so we can analize the resolved entity
        // without the array expansion.
        console.log('Resolving logical entity with normalized directive.');
        resOpt.directives = new AttributeResolutionDirectiveSet(new Set<string>([ 'normalized' ]));
        const resNormalizedEntity = await entity.createResolvedEntityAsync(`normalized_${entity.entityName}`, resOpt, resolvedFolder);
        await resNormalizedEntity.inDocument.saveAsAsync(`${resNormalizedEntity.entityName}.cdm.json`);

        // Another common scenario is to resolve an entity using the 'referenceOnly' directive. 
        // This directives is used to replace the relationships with a foreign key.
        console.log('Resolving logical entity with referenceOnly directive.');
        resOpt.directives = new AttributeResolutionDirectiveSet(new Set<string>([ 'normalized', 'referenceOnly' ]));
        const resReferenceOnlyEntity = await entity.createResolvedEntityAsync(`referenceOnly_${entity.entityName}`, resOpt, resolvedFolder);
        await resReferenceOnlyEntity.inDocument.saveAsAsync(`${resReferenceOnlyEntity.entityName}.cdm.json`);

        // When dealing with structured data, like Json or parquet, it sometimes necessary to represent the idea that 
        // a property can hold a complex object. The shape of the complex object is defined by the source entity pointed by the 
        // entity attribute and we use the 'structured' directive to resolve the entity attribute as an attribute group.
        console.log('Resolving logical entity with structured directive.');
        resOpt.directives = new AttributeResolutionDirectiveSet(new Set<string>([ 'normalized', 'structured' ]));
        const resStructuredEntity = await entity.createResolvedEntityAsync(`structured_${entity.entityName}`, resOpt, resolvedFolder);
        await resStructuredEntity.inDocument.saveAsAsync(`${resStructuredEntity.entityName}.cdm.json`);

        // Now let us remove the 'normalized' directive so the array expansion operation can run.
        console.log('Resolving logical entity without directives (array expansion).');
        resOpt.directives = new AttributeResolutionDirectiveSet(new Set<string>([ ]));
        const resArrayEntity = await entity.createResolvedEntityAsync(`array_expansion_${entity.entityName}`, resOpt, resolvedFolder);
        await resArrayEntity.inDocument.saveAsAsync(`${resArrayEntity.entityName}.cdm.json`);
    }
});
