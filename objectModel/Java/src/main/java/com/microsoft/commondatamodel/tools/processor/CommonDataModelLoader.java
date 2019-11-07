package com.microsoft.commondatamodel.tools.processor;

import com.google.common.base.Strings;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDocumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmFolderDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmValidationStep;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.DocumentPersistence;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.DocumentContent;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeResolutionDirectiveSet;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import java.io.File;
import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.PathMatcher;
import java.nio.file.Paths;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class CommonDataModelLoader {
  public static CompletableFuture<Void> loadCorpusFolder(
      final CdmCorpusDefinition corpus,
      final CdmFolderDefinition folder,
      final List<String> ignoreFolders,
      final String version) {
    final String path = corpus.getRootPath() + folder.getFolderPath();

    if (ignoreFolders != null && ignoreFolders.contains(folder.getName())) {
      return CompletableFuture.completedFuture(null);
    }

    String endMatch = ".cdm.json";
    if (!version.endsWith(".json")) {
      endMatch = (!Strings.isNullOrEmpty(version)) ? "." + version + ".cdm.json" : ".cdm.json";
    }

    if (!Files.exists(Paths.get(path))) {
      throw new IllegalStateException("No directory found at " + path + ".");
    }
    final String rootDirectory = new File(path).getParent();
    walkDirectoryTree(rootDirectory, corpus, folder, ignoreFolders, endMatch).join();
    return CompletableFuture.completedFuture(null);
  }

  static CompletableFuture<Void> walkDirectoryTree(final String root, final CdmCorpusDefinition corpus,
                                                   final CdmFolderDefinition folder, final List<String> ignoreFolders,
                                                   final String endMatch) {
    // TODO: 2019-08-21 Implementation is different from C#. Refactor.
    return CompletableFuture.runAsync(() -> {
      final Path rootDir = Paths.get(root);
      final PathMatcher matcher = FileSystems.getDefault().getPathMatcher("glob:*.*");
      // First, process all the files directly under this folder
      try (final Stream<Path> files = Files.walk(rootDir, 1)) {
        final List<Path> fileList = files.filter(
            f -> matcher
                .matches(f.getFileName()))
            .collect(Collectors.toList());

        if (fileList != null) {
          for (final Path fi : fileList) {
            final String fileName = fi.getFileName().toString();
            final String postfix = fileName.substring(fileName.indexOf("."));
            if (postfix.equals(endMatch)) {
             final String content = Files.lines(fi).collect(Collectors.joining());
             final String name = folder.getFolderPath() + fi.getFileName().toString();
             final CdmDocumentDefinition doc = DocumentPersistence.fromData(
                  corpus.getCtx(),
                  name,
                  folder.getNamespace(),
                  folder.getFolderPath(),
                  JMapper.MAP.readValue(content, DocumentContent.class));
              corpus.getDocuments().add(doc);
              System.out.println(String.format("Loading %s", fi));
            }
          }
        }
      } catch (final IOException e) {
        System.out.println(e.getMessage());
      } catch (final Exception e) {
        System.out.println(e.getMessage());
      }

      // Now find all the subdirectories under this directory.
      try (final Stream<Path> files = Files.walk(rootDir, 1)) {
        final List<Path> subDirs = files.filter(Files::isDirectory).collect(Collectors.toList());
        for (final Path dirInfo : subDirs) {
          // Recursive call for each subdirectory.
          loadCorpusFolder(
              corpus,
              folder.getChildFolders().add(dirInfo.getFileName().toString()), ignoreFolders, endMatch
          ).join();
        }
      } catch (final IOException e) {
        System.out.println(e.getMessage());
      } catch (final Exception e) {
        System.out.println(e.getMessage());
      }
    });
  }

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

  public static void persistCorpus(final CdmCorpusDefinition cdmCorpus, final AttributeResolutionDirectiveSet directives) {
    persistCorpus(cdmCorpus, directives, null);
  }

  public static void persistCorpus(final CdmCorpusDefinition cdmCorpus, final AttributeResolutionDirectiveSet directives, final CopyOptions options) {
    if (cdmCorpus != null && cdmCorpus.getChildFolders() != null && cdmCorpus.getChildFolders().size() == 1) {
      persistCorpusFolder(cdmCorpus.getRootPath(), cdmCorpus.getChildFolders().get(0), directives, options);
    }
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