// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import * as cdm from 'cdm.objectmodel';

/**
 * This sample demonstrates how to model a set of common scenarios using projections. 
 * The projections feature provides a way to customize the definition of a logical entity by influencing how the entity is resolved by the object model.
 * Here we will model three common use cases for using projections that are associated with the directives 'referenceOnly', 'structured' and 'normalized'.
 * A single logical definition can be resolved into multiple physical layouts. The directives are used to instruct the ObjectModel about how it should to
 * resolve the logical definition provided. To achieve this, we define projections that run conditionally, depending on the directives provided when
 * calling createResolvedEntityAsync.
 * To get an overview of the projections feature as well as all of the supported operations refer to the link below.
 * https://docs.microsoft.com/en-us/common-data-model/sdk/convert-logical-entities-resolved-entities#projection-overview
 */
async function runSample() {
    // Make a corpus, the corpus is the collection of all documents and folders created or discovered while navigating objects and paths
    const corpus = new cdm.types.CdmCorpusDefinition();

    console.log('Configure storage adapters.');

    // Configure storage adapters to point at the target local manifest location and at the fake public standards
    const pathFromExeToExampleRoot: string = '../../';

    corpus.storage.mount('local', new cdm.types.LocalAdapter(pathFromExeToExampleRoot + '8-logical-manipulation-using-projections/sample-data'));

     // set callback to receive error and warning logs.
     corpus.setEventCallback( (level, message) => { console.log(message) }, cdm.types.cdmStatusLevel.warning);

    corpus.storage.defaultNamespace = 'local'; // local is our default. so any paths that start out navigating without a device tag will assume local

    // Fake cdm, normaly use the CDM Standards adapter
    // mount it as the 'cdm' device, not the default so must use 'cdm:/folder' to get there
    corpus.storage.mount('cdm', new cdm.types.LocalAdapter(pathFromExeToExampleRoot + 'example-public-standards'));

    console.log('Create logical entity definition.');

    const logicalFolder = await corpus.fetchObjectAsync<cdm.types.CdmFolderDefinition>('local:/');
    
    const logicalDoc: cdm.types.CdmDocumentDefinition = logicalFolder.documents.push('Person.cdm.json');
    logicalDoc.imports.push('Address.cdm.json');

    const entity = logicalDoc.definitions.push('Person') as cdm.types.CdmEntityDefinition;

    // Add 'name' data typed attribute.
    const nameAttr = entity.attributes.push('name') as cdm.types.CdmTypeAttributeDefinition;
    nameAttr.dataType = new cdm.types.CdmDataTypeReference(corpus.ctx, 'string', true);

    // Add 'age' data typed attribute.
    const ageAttr = entity.attributes.push('age') as cdm.types.CdmTypeAttributeDefinition;
    ageAttr.dataType = new cdm.types.CdmDataTypeReference(corpus.ctx, 'string', true);

    // Add 'address' entity typed attribute.
    const entityAttr = new cdm.types.CdmEntityAttributeDefinition(corpus.ctx, 'address');
    entityAttr.entity = new cdm.types.CdmEntityReference(corpus.ctx, 'Address', true);
    applyArrayExpansion(entityAttr, 1, 3, '{m}{A}{o}', 'countAttribute');
    applyDefaultBehavior(entityAttr, 'addressFK', 'address');

    entity.attributes.push(entityAttr);

    // Add 'email' data typed attribute.
    const emailAttr = entity.attributes.push('email') as cdm.types.CdmTypeAttributeDefinition;
    emailAttr.dataType = new cdm.types.CdmDataTypeReference(corpus.ctx, 'string', true);

    // Save the logical definition of Person.
    await entity.inDocument.saveAsAsync('Person.cdm.json');

    console.log('Get \'resolved\' folder where the resolved entities will be saved.');

    const resolvedFolder = await corpus.fetchObjectAsync<cdm.types.CdmFolderDefinition>('local:/resolved/');

    const resOpt = new cdm.types.resolveOptions(entity);

    // To get more information about directives and their meaning refer to 
    // https://docs.microsoft.com/en-us/common-data-model/sdk/convert-logical-entities-resolved-entities#directives-guidance-and-the-resulting-resolved-shapes

    // We will start by resolving this entity with the 'normalized' direcitve. 
    // This directive will be used on this and the next two examples so we can analize the resolved entity
    // without the array expansion.
    console.log('Resolving logical entity with normalized directive.');
    resOpt.directives = new cdm.types.AttributeResolutionDirectiveSet(new Set<string>([ 'normalized' ]));
    const resNormalizedEntity = await entity.createResolvedEntityAsync(`normalized_${entity.entityName}`, resOpt, resolvedFolder);
    await resNormalizedEntity.inDocument.saveAsAsync(`${resNormalizedEntity.entityName}.cdm.json`);

    // Another common scenario is to resolve an entity using the 'referenceOnly' directive. 
    // This directives is used to replace the relationships with a foreign key.
    console.log('Resolving logical entity with referenceOnly directive.');
    resOpt.directives = new cdm.types.AttributeResolutionDirectiveSet(new Set<string>([ 'normalized', 'referenceOnly' ]));
    const resReferenceOnlyEntity = await entity.createResolvedEntityAsync(`referenceOnly_${entity.entityName}`, resOpt, resolvedFolder);
    await resReferenceOnlyEntity.inDocument.saveAsAsync(`${resReferenceOnlyEntity.entityName}.cdm.json`);

    // When dealing with structured data, like Json or parquet, it sometimes necessary to represent the idea that 
    // a property can hold a complex object. The shape of the complex object is defined by the source entity pointed by the 
    // entity attribute and we use the 'structured' directive to resolve the entity attribute as an attribute group.
    console.log('Resolving logical entity with structured directive.');
    resOpt.directives = new cdm.types.AttributeResolutionDirectiveSet(new Set<string>([ 'normalized', 'structured' ]));
    const resStructuredEntity = await entity.createResolvedEntityAsync(`structured_${entity.entityName}`, resOpt, resolvedFolder);
    await resStructuredEntity.inDocument.saveAsAsync(`${resStructuredEntity.entityName}.cdm.json`);

    // Now let us remove the 'normalized' directive so the array expansion operation can run.
    console.log('Resolving logical entity without directives (array expansion).');
    resOpt.directives = new cdm.types.AttributeResolutionDirectiveSet(new Set<string>([ ]));
    const resArrayEntity = await entity.createResolvedEntityAsync(`array_expansion_${entity.entityName}`, resOpt, resolvedFolder);
    await resArrayEntity.inDocument.saveAsAsync(`${resArrayEntity.entityName}.cdm.json`);
}

/**
 * Applies the replaceAsForeignKey and addAttributeGroup operations to the entity attribute provided.
 * @param name entityAttr
 * @param name fkAttrName
 * @param name attrGroupName
 */
function applyDefaultBehavior(entityAttr: cdm.types.CdmEntityAttributeDefinition, fkAttrName: string, attrGroupName: string) {
    const ctx = entityAttr.ctx;
    const projection = new cdm.types.CdmProjection(ctx);
    // Link for the Source property documentation.
    // https://docs.microsoft.com/en-us/common-data-model/sdk/convert-logical-entities-resolved-entities#source
    projection.source = entityAttr.entity;
    // Link for the RunSequentially property documentation.
    // https://docs.microsoft.com/en-us/common-data-model/sdk/convert-logical-entities-resolved-entities#run-sequentially
    projection.runSequentially = true;
    entityAttr.entity = new cdm.types.CdmEntityReference(ctx, projection, false);

    if (fkAttrName) {
        const foreignKeyAttr = new cdm.types.CdmTypeAttributeDefinition(ctx, fkAttrName);
        foreignKeyAttr.dataType = new cdm.types.CdmDataTypeReference(ctx, 'entityId', true);

        // Link for the ReplaceAsForeignKey operation documentation.
        // https://docs.microsoft.com/en-us/common-data-model/sdk/projections/replaceasforeignkey
        const replaceAsFKOperation = new cdm.types.CdmOperationReplaceAsForeignKey(ctx);
        replaceAsFKOperation.condition = 'referenceOnly';
        replaceAsFKOperation.reference = 'addressLine';
        replaceAsFKOperation.replaceWith = foreignKeyAttr;
        projection.operations.push(replaceAsFKOperation);
    }

    if (attrGroupName) {
        // Link for the AddAttributeGroup operation documentation.
        // https://docs.microsoft.com/en-us/common-data-model/sdk/projections/addattributegroup
        const addAttrGroupOperation = new cdm.types.CdmOperationAddAttributeGroup(ctx);
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
function applyArrayExpansion(entityAttr: cdm.types.CdmEntityAttributeDefinition, startOrdinal: number, endOrdinal: number, renameFormat: string, countAttName?: string) {
    const ctx: cdm.types.CdmCorpusContext = entityAttr.ctx;
    const projection = new cdm.types.CdmProjection(ctx);
    projection.source = entityAttr.entity;
    projection.runSequentially = true;
    // Link for the Condition property documentation.
    // https://docs.microsoft.com/en-us/common-data-model/sdk/convert-logical-entities-resolved-entities#condition
    projection.condition = '!normalized';

    entityAttr.entity = new cdm.types.CdmEntityReference(ctx, projection, false);

    // Link for the ArrayExpansion operation documentation.
    // https://docs.microsoft.com/en-us/common-data-model/sdk/projections/arrayexpansion
    const arrExpansionOperation = new cdm.types.CdmOperationArrayExpansion(ctx);
    arrExpansionOperation.startOrdinal = startOrdinal;
    arrExpansionOperation.endOrdinal = endOrdinal;
    projection.operations.push(arrExpansionOperation);

    // Link for the RenameAttributes operation documentation.
    // https://docs.microsoft.com/en-us/common-data-model/sdk/projections/renameattributes
    // Doing an ArrayExpansion without a RenameAttributes afterwards will result in the expanded attributes being merged in the final resolved entity.
    // This is because ArrayExpansion does not rename the attributes it expands by default. The expanded attributes end up with the same name and gets merged.
    // Example: We expand A to A[1], A[2], A[3], but A[1], A[2], A[3] are still named "A".
    const renameAttrsOperation = new cdm.types.CdmOperationRenameAttributes(ctx);
    renameAttrsOperation.renameFormat = renameFormat;
    projection.operations.push(renameAttrsOperation);

    if (countAttName) {
        const countAttribute = new cdm.types.CdmTypeAttributeDefinition(ctx, countAttName);
        countAttribute.dataType = new cdm.types.CdmDataTypeReference(ctx, 'integer', true);

        // Link for the AddCountAttribute operation documentation.
        // https://docs.microsoft.com/en-us/common-data-model/sdk/projections/addcountattribute
        // It is recommended, but not mandated, to be used with the ArrayExpansion operation to provide an ArrayExpansion a count attribute that
        // represents the total number of expanded elements. AddCountAttribute can also be used by itself.
        const addCountAttrOperation = new cdm.types.CdmOperationAddCountAttribute(ctx);
        addCountAttrOperation.countAttribute = countAttribute;
        projection.operations.push(addCountAttrOperation);
    }
}

runSample();