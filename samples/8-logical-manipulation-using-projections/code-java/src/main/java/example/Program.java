// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package example;

import java.util.Arrays;
import java.util.HashSet;
import java.util.concurrent.ExecutionException;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDataTypeReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDocumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityAttributeDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmFolderDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTypeAttributeDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmOperationAddAttributeGroup;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmOperationAddCountAttribute;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmOperationArrayExpansion;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmOperationRenameAttributes;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmOperationReplaceAsForeignKey;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmProjection;
import com.microsoft.commondatamodel.objectmodel.enums.CdmStatusLevel;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeResolutionDirectiveSet;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;

/**
 * This sample demonstrates how to model a set of common scenarios using projections. 
 * The projections feature provides a way to customize the definition of a logical entity by influencing how the entity is resolved by the object model.
 * Here we will model three common use cases for using projections that are associated with the directives "referenceOnly", "structured" and "normalized".
 * A single logical definition can be resolved into multiple physical layouts. The directives are used to instruct the ObjectModel about how it should to
 * resolve the logical definition provided. To achieve this, we define projections that run conditionally, depending on the directives provided when
 * calling createResolvedEntityAsync.
 * To get an overview of the projections feature as well as all of the supported operations refer to the link below.
 * https://docs.microsoft.com/en-us/common-data-model/sdk/convert-logical-entities-resolved-entities#projection-overview
 */
public class Program {
    private static final String PATH_FROM_EXE_TO_EXAMPLE_ROOT = "../../";

    public static void main(final String[] args) throws ExecutionException, InterruptedException {
        // Make a corpus, the corpus is the collection of all documents and folders created or discovered while navigating objects and paths
        CdmCorpusDefinition corpus = new CdmCorpusDefinition();

        // set callback to receive error and warning logs.
        corpus.setEventCallback((level, message) -> {
        System.out.println(message);
        }, CdmStatusLevel.Warning);

        System.out.println("Configure storage adapters.");

        // Configure storage adapters to point at the target local manifest location and at the fake public standards
        corpus.getStorage().mount("local", new LocalAdapter(PATH_FROM_EXE_TO_EXAMPLE_ROOT + "8-logical-manipulation-using-projections/sample-data"));
        corpus.getStorage().setDefaultNamespace("local"); // local is our default. so any paths that start out navigating without a device tag will assume local

        // Fake cdm, normaly use the CDM Standards adapter
        // mount it as the "cdm" device, not the default so must use "cdm:/folder" to get there
        corpus.getStorage().mount("cdm", new LocalAdapter(PATH_FROM_EXE_TO_EXAMPLE_ROOT + "example-public-standards"));

        System.out.println("Create logical entity definition.");

        CdmFolderDefinition logicalFolder = corpus.<CdmFolderDefinition>fetchObjectAsync("local:/").join();
        
        CdmDocumentDefinition logicalDoc = logicalFolder.getDocuments().add("Person.cdm.json");
        logicalDoc.getImports().add("Address.cdm.json");

        CdmEntityDefinition entity = logicalDoc.getDefinitions().add("Person");

        // Add "name" data typed attribute.
        CdmTypeAttributeDefinition nameAttr = (CdmTypeAttributeDefinition) entity.getAttributes().add("name");
        nameAttr.setDataType(new CdmDataTypeReference(corpus.getCtx(), "string", true));

        // Add "age" data typed attribute.
        CdmTypeAttributeDefinition ageAttr = (CdmTypeAttributeDefinition) entity.getAttributes().add("age");
        ageAttr.setDataType(new CdmDataTypeReference(corpus.getCtx(), "string", true));

        // Add "address" entity typed attribute.
        CdmEntityAttributeDefinition entityAttr = new CdmEntityAttributeDefinition(corpus.getCtx(), "address");
        entityAttr.setEntity(new CdmEntityReference(corpus.getCtx(), "Address", true));
        applyArrayExpansion(entityAttr, 1, 3, "{m}{A}{o}", "countAttribute");
        ApplyDefaultBehavior(entityAttr, "addressFK", "address");

        entity.getAttributes().add(entityAttr);

        // Add "email" data typed attribute.
        CdmTypeAttributeDefinition emailAttr = (CdmTypeAttributeDefinition) entity.getAttributes().add("email");
        emailAttr.setDataType(new CdmDataTypeReference(corpus.getCtx(), "string", true));

        // Save the logical definition of Person.
        entity.getInDocument().saveAsAsync("Person.cdm.json").join();

        System.out.println("Get \"resolved\" folder where the resolved entities will be saved.");

        CdmFolderDefinition resolvedFolder = corpus.<CdmFolderDefinition>fetchObjectAsync("local:/resolved/").join();

        ResolveOptions resOpt = new ResolveOptions(entity);

        // To get more information about directives and their meaning refer to 
        // https://docs.microsoft.com/en-us/common-data-model/sdk/convert-logical-entities-resolved-entities#directives-guidance-and-the-resulting-resolved-shapes

        // We will start by resolving this entity with the "normalized" direcitve. 
        // This directive will be used on this and the next two examples so we can analize the resolved entity
        // without the array expansion.
        System.out.println("Resolving logical entity with normalized directive.");
        resOpt.setDirectives(new AttributeResolutionDirectiveSet(new HashSet<String>(Arrays.asList("normalized"))));
        CdmEntityDefinition resNormalizedEntity = entity.createResolvedEntityAsync("normalized_" + entity.getEntityName(), resOpt, resolvedFolder).join();
        resNormalizedEntity.getInDocument().saveAsAsync(resNormalizedEntity.getEntityName() + ".cdm.json").join();

        // Another common scenario is to resolve an entity using the "referenceOnly" directive. 
        // This directives is used to replace the relationships with a foreign key.
        System.out.println("Resolving logical entity with referenceOnly directive.");
        resOpt.setDirectives(new AttributeResolutionDirectiveSet(new HashSet<String>(Arrays.asList("normalized", "referenceOnly"))));
        CdmEntityDefinition resReferenceOnlyEntity = entity.createResolvedEntityAsync("referenceOnly_" + entity.getEntityName(), resOpt, resolvedFolder).join();
        resReferenceOnlyEntity.getInDocument().saveAsAsync(resReferenceOnlyEntity.getEntityName() + ".cdm.json").join();

        // When dealing with structured data, like Json or parquet, it sometimes necessary to represent the idea that 
        // a property can hold a complex object. The shape of the complex object is defined by the source entity pointed by the 
        // entity attribute and we use the "structured" directive to resolve the entity attribute as an attribute group.
        System.out.println("Resolving logical entity with structured directive.");
        resOpt.setDirectives(new AttributeResolutionDirectiveSet(new HashSet<String>(Arrays.asList("normalized", "structured"))));
        CdmEntityDefinition resStructuredEntity = entity.createResolvedEntityAsync("structured_" + entity.getEntityName(), resOpt, resolvedFolder).join();
        resStructuredEntity.getInDocument().saveAsAsync(resStructuredEntity.getEntityName() + ".cdm.json").join();

        // Now let us remove the "normalized" directive so the array expansion operation can run.
        System.out.println("Resolving logical entity without directives (array expansion).");
        resOpt.setDirectives(new AttributeResolutionDirectiveSet(new HashSet<String>(Arrays.asList())));
        CdmEntityDefinition resArrayEntity = entity.createResolvedEntityAsync("array_expansion_" + entity.getEntityName(), resOpt, resolvedFolder).join();
        resArrayEntity.getInDocument().saveAsAsync(resArrayEntity.getEntityName() + ".cdm.json").join();
    }

    /**
     * Applies the replaceAsForeignKey and addAttributeGroup operations to the entity attribute provided.
     * @param entityAttr
     * @param fkAttrName
     * @param attrGroupName
     */
    public static void ApplyDefaultBehavior(CdmEntityAttributeDefinition entityAttr, String fkAttrName, String attrGroupName) {
        CdmCorpusContext ctx = entityAttr.getCtx();
        CdmProjection projection = new CdmProjection(ctx);
        // Link for the Source property documentation.
        // https://docs.microsoft.com/en-us/common-data-model/sdk/convert-logical-entities-resolved-entities#source
        projection.setSource(entityAttr.getEntity());
        // Link for the RunSequentially property documentation.
        // https://docs.microsoft.com/en-us/common-data-model/sdk/convert-logical-entities-resolved-entities#run-sequentially
        projection.setRunSequentially(true);
        entityAttr.setEntity(new CdmEntityReference(ctx, projection, false));

        if (fkAttrName != null) {
            CdmTypeAttributeDefinition foreignKeyAttr = new CdmTypeAttributeDefinition(ctx, fkAttrName);
            foreignKeyAttr.setDataType(new CdmDataTypeReference(ctx, "entityId", true));

            // Link for the ReplaceAsForeignKey operation documentation.
            // https://docs.microsoft.com/en-us/common-data-model/sdk/projections/replaceasforeignkey
            CdmOperationReplaceAsForeignKey replaceAsFKOperation = new CdmOperationReplaceAsForeignKey(ctx);
            replaceAsFKOperation.setCondition("referenceOnly");
            replaceAsFKOperation.setReference("addressLine");
            replaceAsFKOperation.setReplaceWith(foreignKeyAttr);
            projection.getOperations().add(replaceAsFKOperation);
        }

        if (attrGroupName != null) {
            // Link for the AddAttributeGroup operation documentation.
            // https://docs.microsoft.com/en-us/common-data-model/sdk/projections/addattributegroup
            CdmOperationAddAttributeGroup addAttrGroupOperation = new CdmOperationAddAttributeGroup(ctx);
            addAttrGroupOperation.setCondition("structured");
            addAttrGroupOperation.setAttributeGroupName(attrGroupName);
            projection.getOperations().add(addAttrGroupOperation);
        }
    }

    /**
     * Applies the arrayExpansion operation to the entity attribute provided.
     * It also takes care of applying a renameAttributes operation and optionally applying a addCountAttribute operation.
     * @param entityAttr
     * @param startOrdinal
     * @param endOrdinal
     * @param renameFormat
     * @param countAttName
     */
    public static void applyArrayExpansion(CdmEntityAttributeDefinition entityAttr, int startOrdinal, int endOrdinal, String renameFormat, String countAttName) {
        CdmCorpusContext ctx = entityAttr.getCtx();
        CdmProjection projection = new CdmProjection(ctx);
        projection.setSource(entityAttr.getEntity());
        projection.setRunSequentially(true);
        // Link for the Condition property documentation.
        // https://docs.microsoft.com/en-us/common-data-model/sdk/convert-logical-entities-resolved-entities#condition
        projection.setCondition("!normalized");

        entityAttr.setEntity(new CdmEntityReference(ctx, projection, false));

        // Link for the ArrayExpansion operation documentation.
        // https://docs.microsoft.com/en-us/common-data-model/sdk/projections/arrayexpansion
        CdmOperationArrayExpansion arrExpansionOperation = new CdmOperationArrayExpansion(ctx);
        arrExpansionOperation.setStartOrdinal(startOrdinal);
        arrExpansionOperation.setEndOrdinal(endOrdinal);
        projection.getOperations().add(arrExpansionOperation);

        // Link for the RenameAttributes operation documentation.
        // https://docs.microsoft.com/en-us/common-data-model/sdk/projections/renameattributes
        // Doing an ArrayExpansion without a RenameAttributes afterwards will result in the expanded attributes being merged in the final resolved entity.
        // This is because ArrayExpansion does not rename the attributes it expands by default. The expanded attributes end up with the same name and gets merged.
        // Example: We expand A to A[1], A[2], A[3], but A[1], A[2], A[3] are still named "A".
        CdmOperationRenameAttributes renameAttrsOperation = new CdmOperationRenameAttributes(ctx);
        renameAttrsOperation.setRenameFormat(renameFormat);
        projection.getOperations().add(renameAttrsOperation);

        if (countAttName != null) {
            CdmTypeAttributeDefinition countAttribute = new CdmTypeAttributeDefinition(ctx, countAttName);
            countAttribute.setDataType(new CdmDataTypeReference(ctx, "integer", true));

            // Link for the AddCountAttribute operation documentation.
            // https://docs.microsoft.com/en-us/common-data-model/sdk/projections/addcountattribute
            // It is recommended, but not mandated, to be used with the ArrayExpansion operation to provide an ArrayExpansion a count attribute that
            // represents the total number of expanded elements. AddCountAttribute can also be used by itself.
            CdmOperationAddCountAttribute addCountAttrOperation = new CdmOperationAddCountAttribute(ctx);
            addCountAttrOperation.setCountAttribute(countAttribute);
            projection.getOperations().add(addCountAttrOperation);
        }
    }
}