package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmLocalEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.LocalEntityDeclaration;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.ManifestContent;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolveContext;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import java.io.File;
import java.io.IOException;
import org.testng.annotations.Test;

public class ReadWriteTest {
    private static final String PROJECT_PATH = "src/test/java/com/microsoft/commondatamodel/objectmodel/persistence/cdmfolder/";

    @Test
    public void readWriteTest() throws IOException {
      final CdmCorpusDefinition corpus = new CdmCorpusDefinition();

      File jsonFile = new File(PROJECT_PATH + "default.manifest.cdm.json");
      final ManifestContent manifestContent = JMapper.MAP.readValue(jsonFile, ManifestContent.class);
      final CdmManifestDefinition manifestDef = ManifestPersistence.fromData(corpus.getCtx(), "blah", "local", "/", manifestContent);

      final ManifestContent outManifest = ManifestPersistence.toData(manifestDef, new ResolveOptions(), new CopyOptions());
      jsonFile = new File("src/test/java/com/microsoft/commondatamodel/objectmodel/persistence/cdmfolder/out.manifest.cdm.json");
      JMapper.WRITER.writeValue(jsonFile, outManifest);

        // assertTrue(classUnderTest.someLibraryMethod(), "someLibraryMethod should return 'true'");
    }

    @Test
    public void testLocalEntityDeclarationPersistence() throws IOException {

      final CdmCorpusContext ctx = new ResolveContext(new CdmCorpusDefinition());

      final File jsonFile = new File(PROJECT_PATH + "localentitydeclaration.cdm.json");
      LocalEntityDeclaration localEntityDecl = JMapper.MAP.readValue(jsonFile, LocalEntityDeclaration.class);
      final CdmEntityDeclarationDefinition localEntityDef = LocalEntityDeclarationPersistence.fromData(ctx, "/", localEntityDecl);

      localEntityDecl = LocalEntityDeclarationPersistence.toData(
          (CdmLocalEntityDeclarationDefinition) localEntityDef,
          new ResolveOptions(),
          new CopyOptions());
      JMapper.MAP.writeValue(new File(PROJECT_PATH + "out.localentitydeclaration.cdm.json"), localEntityDecl);

      // assertTrue(classUnderTest.someLibraryMethod(), "someLibraryMethod should return 'true'");
    }
}
