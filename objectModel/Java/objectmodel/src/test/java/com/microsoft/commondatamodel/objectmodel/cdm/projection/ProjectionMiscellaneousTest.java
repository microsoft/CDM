// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.projection;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CardinalitySettings;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmStatusLevel;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeResolutionDirectiveSet;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.io.File;
import java.util.*;

/**
 * Various projections scenarios, partner scenarios, bug fixes
 */
public class ProjectionMiscellaneousTest {
    private final String foundationJsonPath = "cdm:/foundations.cdm.json";

    private static List<HashSet<String>> resOptsCombinations = new ArrayList<>(
        Arrays.asList(
            new HashSet<>(Arrays.asList()),
            new HashSet<>(Arrays.asList("referenceOnly")),
            new HashSet<>(Arrays.asList("normalized")),
            new HashSet<>(Arrays.asList("structured")),
            new HashSet<>(Arrays.asList("referenceOnly", "normalized")),
            new HashSet<>(Arrays.asList("referenceOnly", "structured")),
            new HashSet<>(Arrays.asList("normalized", "structured")),
            new HashSet<>(Arrays.asList("referenceOnly", "normalized", "structured"))
        )
    );

    /**
     * The path between TestDataPath and TestName.
     */
    private static final String TESTS_SUBPATH =
        new File(new File(new File(
            "cdm"),
            "projection"),
            "testProjectionMiscellaneous")
            .toString();

    /**
     * Test case scenario for Bug #25 from the projections internal bug bash
     * Reference Link: https://commondatamodel.visualstudio.com/CDM/_workitems/edit/25
     */
    @Test
    public void testMissingConditionInJson() throws InterruptedException {
        String testName = "testMissingConditionInJson";

        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, testName, null);
        corpus.setEventCallback((CdmStatusLevel level, String message) -> {
            Assert.fail(message);
        }, CdmStatusLevel.Warning);

        CdmManifestDefinition manifest = (CdmManifestDefinition) corpus.fetchObjectAsync("default.manifest.cdm.json").join();

        String entityName = "SalesNestedFK";
        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName, manifest).join();
        Assert.assertNotNull(entity);

        ResolveOptions resOpt = new ResolveOptions(entity.getInDocument());
        // where, resOptsCombinations[1] == "referenceOnly"
        resOpt.setDirectives(new AttributeResolutionDirectiveSet(resOptsCombinations.get(1)));

        CdmFolderDefinition resolvedFolder = corpus.getStorage().fetchRootFolder("output");

        Map<String, Boolean> wasInfoMessageReceived = new HashMap<>();
        wasInfoMessageReceived.put("infoMessageReceived", false);

        corpus.setEventCallback((CdmStatusLevel level, String message) -> {
            if (StringUtils.equalsWithIgnoreCase("CdmProjection | Optional expression missing. Implicit expression will automatically apply. | ConstructProjectionContext", message)) {
                wasInfoMessageReceived.put("infoMessageReceived", true);
            }
        }, CdmStatusLevel.Info);

        CdmEntityDefinition resolvedEntity = entity.createResolvedEntityAsync("Resolved_" + entityName + ".cdm.json", resOpt, resolvedFolder).join();
        Assert.assertNotNull(resolvedEntity);

        Assert.assertTrue(wasInfoMessageReceived.get("infoMessageReceived"));
    }

    /**
     * Test case scenario for Bug #24 from the projections internal bug bash
     * Reference Link: https://commondatamodel.visualstudio.com/CDM/_workitems/edit/24
     */
    @Test
    public void testInvalidOperationType() throws InterruptedException {
        String testName = "testInvalidOperationType";

        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, testName, null);
        corpus.setEventCallback((CdmStatusLevel level, String message) -> {
            if (!StringUtils.equalsWithIgnoreCase("ProjectionPersistence | Invalid operation type 'replaceAsForeignKey11111'. | FromData", message)) {
                Assert.fail(message);
            }
        }, CdmStatusLevel.Warning);

        CdmManifestDefinition manifest = (CdmManifestDefinition) corpus.fetchObjectAsync("default.manifest.cdm.json").join();

        // Raise error: "ProjectionPersistence | Invalid operation type 'replaceAsForeignKey11111'. | FromData",
        // when attempting to load a projection with an invalid operation
        String entityName = "SalesNestedFK";
        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName, manifest).join();
        Assert.assertNotNull(entity);
    }

    /**
     * Test case scenario for Bug #23 from the projections internal bug bash
     * Reference Link: https://commondatamodel.visualstudio.com/CDM/_workitems/edit/23
     */
    @Test
    public void testZeroMinimumCardinality() throws InterruptedException {
        String testName = "testZeroMinimumCardinality";

        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, testName, null);

        corpus.setEventCallback((CdmStatusLevel level, String message) -> {
            if (!message.contains("CardinalitySettings | Invalid minimum cardinality -1.")) {
                Assert.fail("Some unexpected failure - " + message + "!");
            }
        }, CdmStatusLevel.Warning);

        // Create Local Root Folder
        CdmFolderDefinition localRoot = corpus.getStorage().fetchRootFolder("local");

        // Create Manifest
        CdmManifestDefinition manifest = corpus.makeObject(CdmObjectType.ManifestDef, "default");
        localRoot.getDocuments().add(manifest, "default.manifest.cdm.json");

        String entityName = "TestEntity";

        // Create Entity
        CdmEntityDefinition entity = corpus.makeObject(CdmObjectType.EntityDef, entityName);
        entity.setExtendsEntity(corpus.makeRef(CdmObjectType.EntityRef, "CdmEntity", true));

        // Create Entity Document
        CdmDocumentDefinition document = corpus.makeObject(CdmObjectType.DocumentDef, entityName + ".cdm.json", false);
        document.getDefinitions().add(entity);
        localRoot.getDocuments().add(document, document.getName());
        manifest.getEntities().add(entity);

        String attributeName = "testAttribute";
        String attributeDataType = "string";
        String attributePurpose = "hasA";

        // Create Type Attribute
        CdmTypeAttributeDefinition attribute = corpus.makeObject(CdmObjectType.TypeAttributeDef, attributeName,false);
        attribute.setDataType(corpus.makeRef(CdmObjectType.DataTypeRef, attributeDataType, true));
        attribute.setPurpose(corpus.makeRef(CdmObjectType.PurposeRef, attributePurpose, true));
        attribute.setDisplayName(attributeName);

        if (entity != null) {
            entity.getAttributes().add(attribute);
        }

        attribute.setCardinality(new CardinalitySettings(attribute));
        attribute.getCardinality().setMinimum("0");
        attribute.getCardinality().setMaximum("*");

        Assert.assertTrue(attribute.fetchIsNullable() == true);
    }
}
