package com.microsoft.commondatamodel.objectmodel.storage;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import org.apache.commons.io.FileUtils;

/**
 * Implementation of the storage adapter interface which operates over a local filesystem.
 */
public class LocalAdapter implements StorageAdapter {
  static final String TYPE = "local";
  private String root;
  private String fullRoot;
  private String locationHint;

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
    if (this.locationHint != null) {
      configObject.put("locationHint", this.locationHint);
    }

    resultConfig.put("config", configObject);
    try {
      return JMapper.MAP.writeValueAsString(resultConfig);
    } catch (final JsonProcessingException e) {
      throw new StorageAdapterException("Failed to construct config string", e);
    }
  }

  public boolean canRead() {
    return true;
  }

  public CompletableFuture<String> readAsync(final String corpusPath) {
    return CompletableFuture.supplyAsync(() -> {
      final String path = createAdapterPath(corpusPath);

      try (final BufferedReader br = new BufferedReader(new FileReader(path))) {
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

  public boolean canWrite() {
    return true;
  }

  public CompletableFuture<Void> writeAsync(final String corpusPath, final String data) {
    if (!corpusPath.startsWith("/")) {
      throw new StorageAdapterException("CdmCorpusDefinition path should start with /");
    }
    return CompletableFuture.runAsync(() -> {
      // ensure that the path exists before trying to write the file
      final String path = createAdapterPath(corpusPath);

      if (!ensurePath(path)) {
        throw new StorageAdapterException("Could not create folder for document " + path);
      }

      final File file = new File(path);

      try {
        FileUtils.writeStringToFile(file, data);
      } catch (final IOException e) {
        throw new StorageAdapterException("Failed to write file at corpus path " + corpusPath, e);
      }
    });
  }

  public CompletableFuture<Boolean> dirExists(final String folderPath) {
    return CompletableFuture
        .supplyAsync(() -> Files.isDirectory(Paths.get(createAdapterPath(folderPath))));
  }

  public String createAdapterPath(String corpusPath) {
    if (corpusPath.contains(":")) {
      corpusPath = StringUtils.slice(corpusPath, corpusPath.indexOf(":") + 1);
    }

    if (Paths.get(this.fullRoot).isAbsolute()) {
      return convertPathToAbsolutePath(this.fullRoot + corpusPath);
    }

      return convertPathToAbsolutePath(Paths.get(System.getProperty("user.dir"), this.fullRoot) + corpusPath);
  }

  public void clearCache() {
    // Intended to return none.
    return;
  }

  public String createCorpusPath(final String adapterPath) {
    // make this a file system path and normalize it
    String formattedAdapterPath = this.convertPathToAbsolutePath(adapterPath);
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

  public CompletableFuture<OffsetDateTime> computeLastModifiedTimeAsync(final String corpusPath) {
    return CompletableFuture.supplyAsync(() -> {
      final Path path = Paths.get(this.createAdapterPath(corpusPath));

      if (Files.exists(path)) {
        try {
          return OffsetDateTime
                  .ofInstant(Files.getLastModifiedTime(path).toInstant(), ZoneOffset.UTC);
        } catch (final IOException e) {
          throw new StorageAdapterException(
                  "Failed to get last modified time of file at adapter path " + corpusPath, e);
        }
      } else {
        return null;
      }
    });
  }

  public CompletableFuture<List<String>> fetchAllFilesAsync(final String folderCorpusPath) {
    // Returns a list corpus paths to all files and folders at or under the
    // provided corpus path to a folder
    return CompletableFuture.supplyAsync(() -> {
      final List<String> allFiles = new ArrayList<>();
      final String adapterPath = createAdapterPath(folderCorpusPath);

      final File[] content = new File(adapterPath).listFiles();

      if (content != null) {
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
      }

      return allFiles;
    });
  }

  /**
   * Returns true if the directory exists from the given path, false otherwise.s
   */
  private CompletableFuture<Boolean> dirExistsAsync(final String folderPath) {
    return CompletableFuture
            .supplyAsync(() -> Files.isDirectory(Paths.get(this.createAdapterPath(folderPath))));
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
   * @param path Any kind of path
   * @return absolute path
   */
  private String convertPathToAbsolutePath(final String path) {
    return FileSystems.getDefault()
            .getPath(path)
            .normalize().toAbsolutePath()
            .toString();
  }

  @Override
  public String getLocationHint() {
    return locationHint;
  }

  @Override
  public void setLocationHint(final String locationHint) {
    this.locationHint = locationHint;
  }

  public String getFullRoot() {
    return fullRoot;
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
      this.locationHint = configsJson.get("locationHint").asText();
    }
    this.fullRoot = new File(this.root).toString();
  }
}
