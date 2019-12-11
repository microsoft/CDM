package com.microsoft.commondatamodel.tools.processor;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDocumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmFolderDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmValidationStep;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeResolutionDirectiveSet;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.concurrent.CompletableFuture;

public class CommonDataModelLoader {

  public static CompletableFuture<Boolean> resolveLocalCorpus(
      CdmCorpusDefinition cdmCorpus,
      CdmValidationStep finishStep) {

    return CompletableFuture.supplyAsync(() -> {
      System.out.println("resolving imports");

      cdmCorpus.getAllDocuments().forEach(tuple -> {
        final ResolveOptions resOpt = new ResolveOptions(tuple.getRight());
        tuple.getRight().indexIfNeededAsync(resOpt).join();
      });

      return true;
    });
  }

  public static void persistCorpusFolder(final String rootPath, final CdmFolderDefinition cdmFolder, final AttributeResolutionDirectiveSet directives) {
    persistCorpusFolder(rootPath, cdmFolder, directives, null);
  }

  public static void persistCorpusFolder(final String rootPath, final CdmFolderDefinition cdmFolder, final AttributeResolutionDirectiveSet directives, final CopyOptions options) {
    if (cdmFolder != null) {
      final String folderPath = rootPath + cdmFolder.getFolderPath();
      try {
        Files.createDirectory(Paths.get(folderPath));
      } catch (final IOException e) {
        e.printStackTrace();
      }

      if (cdmFolder.getDocuments() != null) {
        cdmFolder.getDocuments().forEach(doc -> {
          final ResolveOptions resOpt = new ResolveOptions();
          resOpt.setWrtDoc(doc);
          resOpt.setDirectives(directives);

          persistDocument(rootPath, resOpt, options);
        });

        if (cdmFolder.getChildFolders() != null) {
          cdmFolder.getChildFolders().forEach(f -> persistCorpusFolder(rootPath, f, directives, options));
        }
      }
    }
  }

  public static void persistDocument(final String rootPath, final ResolveOptions resOpt) {
    persistDocument(rootPath, resOpt, null);
  }

  public static void persistDocument(final String rootPath, final ResolveOptions resOpt, final CopyOptions options) {
    final CdmDocumentDefinition wrtDoc = resOpt.getWrtDoc();
    final Object data = wrtDoc.copyData(resOpt, options);
    try {
      // TODO: 2019-08-21 temporary file path needs to be changed.
      final File file = new File("src/main/java/com/microsoft/commondatamodel/tools/internal/result.json.");
//      final File file = new File("D:/temp/persist/result.json");
      file.getParentFile().mkdirs();
      file.createNewFile();
      JMapper.WRITER.writeValue(file, data);
    } catch (final IOException e) {
      e.printStackTrace();
    }
  }
}