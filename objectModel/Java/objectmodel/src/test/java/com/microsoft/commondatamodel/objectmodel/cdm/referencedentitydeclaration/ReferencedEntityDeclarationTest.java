// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.referencedentitydeclaration;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReference;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.ManifestPersistence;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.Model;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;

import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.io.File;

public class ReferencedEntityDeclarationTest {
    private static final String TESTS_SUBPATH = new File("cdm", "referencedentitydeclaration").toString();

    @Test
    public void testRefEntityWithSlashPath() throws InterruptedException {
        CdmCorpusDefinition slashCorpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "TestRefEntityWithSlashPath", null);
        String slashLocalPath = ((LocalAdapter)slashCorpus.getStorage().getNamespaceAdapters().get("local")).getRoot();
        LocalAdapterWithSlashPath slashAdapter = new LocalAdapterWithSlashPath(slashLocalPath, "/");
        slashCorpus.getStorage().mount("slash", slashAdapter);
        slashCorpus.getStorage().setDefaultNamespace("slash");

        // load model.json files with paths generated using both '/' and '\'
        CdmManifestDefinition slashManifest = slashCorpus.<CdmManifestDefinition>fetchObjectAsync("slash:/model.json").join();

        // manually add the reference model location, path will vary on each machine
        CdmTraitReference refModelTrait = (CdmTraitReference) slashManifest.getExhibitsTraits().item("is.modelConversion.referenceModelMap");
        String entityPath = slashManifest.getEntities().get(0).getEntityPath();
        ArrayNode locationNode = (ArrayNode)(refModelTrait.getArguments().get(0).getValue());
        JsonNode jsonNode = locationNode.get(0);
        // remove and replace location key
        ((ObjectNode)jsonNode).remove("location");
        ((ObjectNode)jsonNode).put("location", (slashAdapter.createAdapterPath(entityPath.substring(0, entityPath.lastIndexOf("/")))));

        Model slashModel = ManifestPersistence.toData(slashManifest, new ResolveOptions(), new CopyOptions()).join();

        Assert.assertNotNull(slashModel);
        Assert.assertEquals(1, slashModel.getEntities().size());

        CdmCorpusDefinition backSlashCorpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "TestRefEntityWithSlashPath");
        String backSlashLocalPath = ((LocalAdapter)backSlashCorpus.getStorage().getNamespaceAdapters().get("local")).getRoot();
        LocalAdapterWithSlashPath backSlashAdapter = new LocalAdapterWithSlashPath(backSlashLocalPath, "\\");
        backSlashCorpus.getStorage().mount("backslash", backSlashAdapter);
        backSlashCorpus.getStorage().setDefaultNamespace("backslash");

        CdmManifestDefinition backSlashManifest = backSlashCorpus.<CdmManifestDefinition>fetchObjectAsync("backslash:/model.json").join();

        // manually add the reference model location, path will vary on each machine
        CdmTraitReference backSlashRefModelTrait = (CdmTraitReference) backSlashManifest.getExhibitsTraits().item("is.modelConversion.referenceModelMap");
        String backSlashEntityPath = backSlashManifest.getEntities().get(0).getEntityPath();
        ArrayNode backslashLocationNode = (ArrayNode)(backSlashRefModelTrait.getArguments().get(0).getValue());
        JsonNode backslashJsonNode = backslashLocationNode.get(0);
        // remove and replace location key
        ((ObjectNode)backslashJsonNode).remove("location");
        ((ObjectNode)backslashJsonNode).put("location", (backSlashAdapter.createAdapterPath(backSlashEntityPath.substring(0, backSlashEntityPath.lastIndexOf("/")))));

        Model backSlashModel = ManifestPersistence.toData(backSlashManifest, new ResolveOptions(), new CopyOptions()).join();

        Assert.assertNotNull(backSlashModel);
        Assert.assertEquals(1, backSlashModel.getEntities().size());
    }
}

class LocalAdapterWithSlashPath extends LocalAdapter {
    private String separator;

    public LocalAdapterWithSlashPath(String root, String separator) {
        super(root);
        this.separator = separator;
    }

    public String createAdapterPath(String corpusPath) {
        String basePath = super.createAdapterPath(corpusPath);
        return this.separator == "/" ? basePath.replace("\\", "/") : basePath.replace("/", "\\");
    }

    public String CreateCorpusPath(String adapterPath) {
        return adapterPath;
    }
}
