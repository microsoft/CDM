// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDocumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmFolderDefinition;
import com.microsoft.commondatamodel.objectmodel.persistence.CdmConstants;
import com.microsoft.commondatamodel.objectmodel.enums.CdmValidationStep;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.DocumentPersistence;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.DocumentContent;
import com.microsoft.commondatamodel.objectmodel.utilities.*;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class CommonDataModelLoader {
  public static CompletableFuture<Void> loadCorpusFolderAsync(
      CdmCorpusDefinition corpus,
      CdmFolderDefinition folder,
      List<String> ignoreFolders,
      String version) {
    String path = corpus.getRootPath() + folder.getFolderPath();

    if (ignoreFolders != null && ignoreFolders.contains(folder.getName())) {
      return CompletableFuture.completedFuture(null);
    }

    final String endMatch = (!StringUtils.isNullOrEmpty(version)) ? "." + version + CdmConstants.CDM_EXTENSION : CdmConstants.CDM_EXTENSION;

    if (!Files.exists(Paths.get(path))) {
      throw new IllegalStateException("No directory found at " + path + ".");
    }

    String rootDirectory = new File(path).getParent();
    List<Path> files = new ArrayList<>();
    try (Stream<Path> stream = Files.walk(Paths.get(rootDirectory), 1)) {
      files = stream
          .filter(file -> !Files.isDirectory(file))
          .collect(Collectors.toList());
    } catch (IOException e) {
      System.out.println(e.getMessage());
    }

    // for every document or directory
    files.forEach(fs -> loadDocumentAsync(corpus, folder, fs, endMatch).join());

    return CompletableFuture.completedFuture(null);
  }

  static CompletableFuture<Void> loadDocumentAsync(
      CdmCorpusDefinition corpus,
      CdmFolderDefinition folder,
      Path fileInfo,
      String endMatch) {
    return CompletableFuture.runAsync(() -> {
      final String fileName = fileInfo.getFileName().toString();
      String postfix = fileName.substring(fileName.indexOf("."));
      if (Objects.equals(postfix, endMatch)) {
        try {
          final String content = Files.lines(fileInfo).collect(Collectors.joining());
          final DocumentContent jsonData = JMapper.MAP.readValue(content, DocumentContent.class);
          CdmDocumentDefinition doc = DocumentPersistence.fromObject(
              corpus.getCtx(),
              fileName,
              folder.getNamespace(),
              folder.getFolderPath(),
              jsonData);
          folder.getDocuments().add(doc, fileName);
          System.out.println("Loading " + fileInfo);
        } catch (IOException e) {
          System.out.println(e.getMessage());
        }
      }
    });
  }

  public static CompletableFuture<Boolean> resolveLocalCorpusAsync(
      CdmCorpusDefinition cdmCorpus,
      CdmValidationStep finishStep) {

   return CompletableFuture.supplyAsync(() -> {
     System.out.println("resolving imports");

     List<CdmDocumentDefinition> allDocuments = cdmCorpus.getDocumentLibrary().listAllDocuments();
     for (int i = 0; i < allDocuments.size(); i++) {
       final ResolveOptions resOpt = new ResolveOptions(allDocuments.get(i));
       allDocuments.get(i).indexIfNeededAsync(resOpt, true).join();
     }

     return true;
   });
  }

  public static void persistCorpusFolder(
      String rootPath,
      CdmFolderDefinition cdmFolder,
      AttributeResolutionDirectiveSet directives) {
    persistCorpusFolder(rootPath, cdmFolder, directives, null);
  }

  public static void persistCorpusFolder(
      String rootPath,
      CdmFolderDefinition cdmFolder,
      AttributeResolutionDirectiveSet directives,
      CopyOptions options) {
    if (cdmFolder != null) {
      String folderPath = rootPath + cdmFolder.getFolderPath();
      try {
        Files.createDirectory(Paths.get(folderPath));
      } catch (IOException e) {
        e.printStackTrace();
      }

      if (cdmFolder.getDocuments() != null) {
        cdmFolder.getDocuments().forEach(doc -> {
          ResolveOptions resOpt = new ResolveOptions();
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

  public static void persistDocument(String rootPath, ResolveOptions resOpt) {
    persistDocument(rootPath, resOpt, null);
  }

  public static void persistDocument(String rootPath, ResolveOptions resOpt, CopyOptions options) {
    final CdmDocumentDefinition wrtDoc = resOpt.getWrtDoc();
    Object data = wrtDoc.copyData(resOpt, options);
    try {
      // TODO: 2019-08-21 temporary file path needs to be changed.
      final File file = new File("src/main/java/com/microsoft/commondatamodel/tools/internal/result.json.");
//      final File file = new File("D:/temp/persist/result.json");
      file.getParentFile().mkdirs();
      file.createNewFile();
      JMapper.WRITER.writeValue(file, data);
    } catch (IOException e) {
      e.printStackTrace();
    }
  }
}
