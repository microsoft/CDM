// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.storage;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.microsoft.commondatamodel.objectmodel.utilities.CdmFileMetadata;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.StorageUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.tuple.Pair;

/**
 * Implementation of the storage adapter interface which operates over a local filesystem.
 */
public class LocalAdapter extends StorageAdapterBase {

  static final String TYPE = "local";
  private String root;
  private String fullRoot;

  public LocalAdapter(final String root) {
    this.root = root;
    this.fullRoot = convertPathToAbsolutePath(root);
  }

  /**
   * The default constructor, a user has to apply JSON config after creating it this way.
   */
  public LocalAdapter() {
  }

  @Override
  public String fetchConfig() {
    final ObjectNode resultConfig = JsonNodeFactory.instance.objectNode();
    resultConfig.put("type", TYPE);

    final ObjectNode configObject = JsonNodeFactory.instance.objectNode();
    configObject.put("root", this.root);

    String locationHint = this.getLocationHint();
    if (locationHint != null) {
      configObject.put("locationHint", locationHint);
    }

    resultConfig.put("config", configObject);
    try {
      return JMapper.WRITER.writeValueAsString(resultConfig);
    } catch (final JsonProcessingException e) {
      throw new StorageAdapterException("Failed to construct config string", e);
    }
  }

  @Override
  public boolean canRead() {
    return true;
  }

  @Override
  public CompletableFuture<String> readAsync(final String corpusPath) {
    return CompletableFuture.supplyAsync(() -> {
      final String path = createAdapterPath(corpusPath);

      try (final BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream(path), StandardCharsets.UTF_8))) {
        final StringBuilder result = new StringBuilder();
        String line;
        while ((line = br.readLine()) != null) {
          result.append(line);
        }
        return result.toString();
      } catch (final IOException e) {
        throw new StorageAdapterException("Failed to read file at corpus path " + corpusPath, e);
      }
    });
  }

  @Override
  public boolean canWrite() {
    return true;
  }

  @Override
  public CompletableFuture<Void> writeAsync(final String corpusPath, final String data) {
    return CompletableFuture.runAsync(() -> {
      // ensure that the path exists before trying to write the file
      final String path = createAdapterPath(corpusPath);

      if (!ensurePath(path)) {
        throw new StorageAdapterException("Could not create folder for document " + path);
      }

      final File file = new File(path);

      try {
        FileUtils.writeStringToFile(file, data, StandardCharsets.UTF_8);
      } catch (final IOException e) {
        throw new StorageAdapterException("Failed to write file at corpus path " + corpusPath, e);
      }
    });
  }

  public CompletableFuture<Boolean> dirExists(final String folderPath) {
    return CompletableFuture.supplyAsync(() -> Files.isDirectory(Paths.get(createAdapterPath(folderPath))));
  }

  @Override
  public String createAdapterPath(String corpusPath) {
    final Pair<String, String> pathTuple = StorageUtils.splitNamespacePath(corpusPath);
    if (pathTuple == null) {
      return null;
    }

    corpusPath = pathTuple.getRight();

    if (Paths.get(this.fullRoot).isAbsolute()) {
      return convertPathToAbsolutePath(Paths.get(this.fullRoot, corpusPath).toString());
    }

    return convertPathToAbsolutePath(Paths.get(Paths.get(System.getProperty("user.dir"), this.fullRoot).toString(), corpusPath).toString());
  }

  @Override
  public String createCorpusPath(final String adapterPath) {
    if (StringUtils.isNullOrTrimEmpty(adapterPath) || adapterPath.startsWith("http")) {
      return null;
    }

    // make this a file system path and normalize it
    String formattedAdapterPath = this.convertPathToAbsolutePath(adapterPath);
    if (formattedAdapterPath == null) {
      return null;
    }

    formattedAdapterPath = formattedAdapterPath.replace('\\', '/');
    final String formattedRoot = this.fullRoot.replace('\\', '/');

    // might not be an adapterPath that we understand. check that first
    if (formattedAdapterPath.startsWith(formattedRoot)) {
      return StringUtils.slice(
          formattedAdapterPath,
          formattedRoot.length()).replace("\\", "/");
    }

    return null; // signal that we didn't recognize path as one for this adapter
  }

  @Override
  public CompletableFuture<OffsetDateTime> computeLastModifiedTimeAsync(final String corpusPath) {
    final CdmFileMetadata fileMetadata = this.fetchFileMetadataAsync(corpusPath).join();

    if (fileMetadata == null) {
      return CompletableFuture.completedFuture(null);
    }

    return CompletableFuture.completedFuture(fileMetadata.getLastModifiedTime());
  }

  @Override
  public CompletableFuture<CdmFileMetadata> fetchFileMetadataAsync(final String corpusPath) {
    return CompletableFuture.supplyAsync(() -> {
      final Path adapterPath = Paths.get(this.createAdapterPath(corpusPath));

      if (Files.exists(adapterPath)) {
        try {
          final OffsetDateTime lastTime = OffsetDateTime
                  .ofInstant(Files.getLastModifiedTime(adapterPath).toInstant(), ZoneOffset.UTC);
          return new CdmFileMetadata(lastTime, Files.size(adapterPath));
        } catch (final IOException e) {
          throw new StorageAdapterException(
                  "Failed to get last modified time of file at adapter path " + corpusPath, e);
        }
      } else {
        return null;
      }
    });
  }

  @Override
  public CompletableFuture<List<String>> fetchAllFilesAsync(final String folderCorpusPath) {
    // Returns a list corpus paths to all files and folders at or under the
    // provided corpus path to a folder
    return CompletableFuture.supplyAsync(() -> {
      final List<String> allFiles = new ArrayList<>();
      final String adapterPath = createAdapterPath(folderCorpusPath);

      final File[] content = new File(adapterPath).listFiles();

      if (content == null) {
        throw new StorageAdapterException("This abstract pathname does not denote a directory, or if an I/O error occurs.");
      }

      for (final File childPath : content) {
        final String childCorpusPath = createCorpusPath(childPath.getPath());
        try {
          if (dirExistsAsync(childCorpusPath).get()) {
            final List<String> subFiles = fetchAllFilesAsync(childCorpusPath).get();
            allFiles.addAll(subFiles);
          } else {
            allFiles.add(childCorpusPath);
          }
        } catch (final InterruptedException | ExecutionException e) {
          throw new StorageAdapterException(
                  "Failed to get all files for folderCorpusPath:" + folderCorpusPath, e);
        }
      }

      return allFiles;
    });
  }

  @Override
  public CompletableFuture<HashMap<String, CdmFileMetadata>> fetchAllFilesMetadataAsync(final String folderCorpusPath) {
    HashMap<String, CdmFileMetadata> fileMetadatas = new HashMap<String, CdmFileMetadata>();
    List<String> fileNames = this.fetchAllFilesAsync(folderCorpusPath).join();

    for (String fileName : fileNames) {
      Path path = Paths.get(this.createAdapterPath(fileName));
      if (Files.exists(path)) {
        try {
          final OffsetDateTime lastTime = OffsetDateTime
                  .ofInstant(Files.getLastModifiedTime(path).toInstant(), ZoneOffset.UTC);
          fileMetadatas.put(fileName, new CdmFileMetadata(lastTime, Files.size(path)));
        } catch (IOException e) {
        }
      }
      else {
        fileMetadatas.put(fileName, null);
      }
    }

    return CompletableFuture.completedFuture(fileMetadatas);
  }

  /**
   * Returns true if the directory exists from the given path, false otherwise.
   */
  private CompletableFuture<Boolean> dirExistsAsync(final String folderPath) {
    return CompletableFuture.supplyAsync(() -> Files.isDirectory(Paths.get(this.createAdapterPath(folderPath))));
  }

  /**
   * Recursive check for / create path to house a document.
   */
  private boolean ensurePath(final String pathFor) throws StorageAdapterException {
    final int pathEnd = pathFor.lastIndexOf(File.separator);

    if (pathEnd == -1) {
      return false;
    }

    final String pathTo = pathFor.substring(0, pathEnd);

    if (Files.exists(Paths.get(pathTo))) {
      return true;
    }

    // make sure there is a place to put the directory that is missing
    if (!ensurePath(pathTo)) {
      return false;
    }

    try {
      Files.createDirectory(Paths.get(pathTo));
    } catch (final IOException e) {
      throw new StorageAdapterException("Failed to create directory at path " + pathTo, e);
    }

    return true;
  }

  /**
   * Converts the given path to an absolute path.
   *
   * @param path Any kind of path.
   * @return absolute path or null if path is invalid.
   */
  private String convertPathToAbsolutePath(final String path) {
    try {
      return new File(path).getCanonicalPath();
    } catch (Exception E) {
      return null;
    }
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   * @return String
   */
  @Deprecated
  public String getFullRoot() {
    return fullRoot;
  }

  public String getRoot() {
    return root;
  }

  @Override
  public void updateConfig(final String config) throws IOException {
    if (config == null) {
      throw new StorageAdapterException("Local adapter needs a config.");
    }
    final JsonNode configsJson = JMapper.MAP.readTree(config);
    if (!configsJson.has("root")) {
      throw new StorageAdapterException("The root has to be specified and cannot be null.");
    }
    this.root = configsJson.get("root").asText();
    if (configsJson.has("locationHint")) {
      this.setLocationHint(configsJson.get("locationHint").asText());
    }
    this.fullRoot = new File(this.root).toString();
  }
}
