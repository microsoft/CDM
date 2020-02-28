// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

import com.microsoft.commondatamodel.objectmodel.FileReadWriteUtil;
import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmLocalEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.LocalEntityDeclaration;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.ManifestContent;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.ModelJsonTestBase;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolveContext;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import java.io.File;
import java.io.IOException;
import org.testng.annotations.Test;

public class ReadWriteTest {
    private static final String TEST_SUBPATH = "persistence/cdmfolder/readwrite";

    @Test
    public void testReadWrite() throws IOException, InterruptedException {
      final CdmCorpusDefinition corpus = new CdmCorpusDefinition();

      final ManifestContent manifestContent = JMapper.MAP.readValue(TestHelper.getInputFileContent(TEST_SUBPATH, "testReadWrite", "default.manifest.cdm.json"), ManifestContent.class);
      final CdmManifestDefinition manifestDef = ManifestPersistence.fromObject(corpus.getCtx(), "blah", "local", "/", manifestContent);

      final ManifestContent outManifest = ManifestPersistence.toData(manifestDef, new ResolveOptions(), new CopyOptions());
      TestHelper.writeActualOutputFileContent(TEST_SUBPATH, "testReadWrite", "out.manifest.cdm.json", ModelJsonTestBase.serialize(outManifest));
        // assertTrue(classUnderTest.someLibraryMethod(), "someLibraryMethod should return 'true'");
    }

    @Test
    public void testLocalEntityDeclarationPersistence() throws IOException, InterruptedException {

      final CdmCorpusContext ctx = new ResolveContext(new CdmCorpusDefinition());

      LocalEntityDeclaration localEntityDecl = JMapper.MAP.readValue(TestHelper.getInputFileContent(TEST_SUBPATH, "testLocalEntityDeclarationPersistence", "localentitydeclaration.cdm.json"), LocalEntityDeclaration.class);

      final CdmEntityDeclarationDefinition localEntityDef = LocalEntityDeclarationPersistence.fromData(ctx, "/", localEntityDecl);

      localEntityDecl = LocalEntityDeclarationPersistence.toData(
          (CdmLocalEntityDeclarationDefinition) localEntityDef,
          new ResolveOptions(),
          new CopyOptions());

      TestHelper.writeActualOutputFileContent(TEST_SUBPATH, "testLocalEntityDeclarationPersistence", "out.localentitydeclaration.cdm.json", ModelJsonTestBase.serialize(localEntityDecl));

        // assertTrue(classUnderTest.someLibraryMethod(), "someLibraryMethod should return 'true'");
    }
}
