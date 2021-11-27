// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.samples;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.*;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeResolutionDirectiveSet;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;

import org.testng.Assert;
import org.testng.annotations.Test;

import java.util.Arrays;
import java.util.HashSet;

public class LogicalManipulationUsingProjectionsTest extends SampleTestBase {
    private static final String TEST_NAME = "TestLogicalManipulationUsingProjections";

    @Test
    public void testLogicalManipulationUsingProjections() {
        this.checkSampleRunTestsFlag();

        try {
            TestHelper.deleteFilesFromActualOutput(TestHelper.getActualOutputFolderPath(TESTS_SUBPATH, TEST_NAME));
            runSample(setupCdmCorpus());
            TestHelper.assertFolderFilesEquality(
                    TestHelper.getExpectedOutputFolderPath(TESTS_SUBPATH, TEST_NAME),
                    TestHelper.getActualOutputFolderPath(TESTS_SUBPATH, TEST_NAME), true);
        } catch (Exception e) {
            Assert.fail(e.getMessage());
        }
    }

    private static CdmCorpusDefinition setupCdmCorpus() throws InterruptedException {
        CdmCorpusDefinition corpus = new CdmCorpusDefinition();
        corpus.getStorage().mount("local", new LocalAdapter(TestHelper.getInputFolderPath(TESTS_SUBPATH, TEST_NAME)));
        corpus.getStorage().setDefaultNamespace("local");
        corpus.getStorage().mount("output", new LocalAdapter(TestHelper.getActualOutputFolderPath(TESTS_SUBPATH, TEST_NAME)));
        corpus.getStorage().mount("cdm", new LocalAdapter(TestHelper.SAMPLE_SCHEMA_FOLDER_PATH));
        return corpus;
    }

    public static void runSample(CdmCorpusDefinition corpus) {
        System.out.println("Create logical entity definition.");

        CdmFolderDefinition logicalFolder = corpus.<CdmFolderDefinition>fetchObjectAsync("output:/").join();

        CdmDocumentDefinition logicalDoc = logicalFolder.getDocuments().add("Person.cdm.json");
        logicalDoc.getImports().add("local:/Address.cdm.json");

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

        CdmFolderDefinition resolvedFolder = corpus.<CdmFolderDefinition>fetchObjectAsync("output:/").join();

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
        CdmOperationRenameAttributes renameAttrsOperation = new CdmOperationRenameAttributes(ctx);
        renameAttrsOperation.setRenameFormat(renameFormat);
        projection.getOperations().add(renameAttrsOperation);

        if (countAttName != null) {
            CdmTypeAttributeDefinition countAttribute = new CdmTypeAttributeDefinition(ctx, countAttName);
            countAttribute.setDataType(new CdmDataTypeReference(ctx, "integer", true));

            // Link for the AddCountAttribute operation documentation.
            // https://docs.microsoft.com/en-us/common-data-model/sdk/projections/addcountattribute
            CdmOperationAddCountAttribute addCountAttrOperation = new CdmOperationAddCountAttribute(ctx);
            addCountAttrOperation.setCountAttribute(countAttribute);
            projection.getOperations().add(addCountAttrOperation);
        }
    }
}
