// Copyright (c) Microsoft Corporation.

package com.microsoft.commondatamodel.objectmodel.storage;

import static org.testng.AssertJUnit.assertFalse;
import static org.testng.AssertJUnit.assertTrue;

import java.io.File;
import java.util.concurrent.ExecutionException;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

public class LocalAdapterTest {

  private static final String VALID_ROOT_PATH = "src/test/resources/storage/localadapter";

  private LocalAdapter localAdapter;

  @BeforeTest
  public void doBeforeTest() {
    localAdapter = new LocalAdapter(VALID_ROOT_PATH);
  }

  @Test
  public void canRead_expectTrue() {
    assertTrue(localAdapter.canRead());
  }

  @Test
  public void read_whenCorpusPathIsValid_whenFileIsJson_expectSuccessful()
          throws ExecutionException, InterruptedException {
    localAdapter.readAsync("/validJson.json").get();
  }

  @Test
  public void read_whenCorpusPathIsInnerAndValid_whenFileIsJson_expectSuccessful() {
    localAdapter.readAsync("/inner/innerValidJson.json");
  }

  @Test(expectedExceptions = StorageAdapterException.class)
  public void read_whenCorpusPathNotStartWithSlash_expectStorageAdapterException() throws Throwable {
    try {
      localAdapter.readAsync("CORPUS_PATH_NOT_START_WITH_SLASH").get();
    } catch (final InterruptedException | ExecutionException e) {
      throw e.getCause();
    }
  }

  @Test
  public void canWrite_expectTrue() {
    assertTrue(localAdapter.canWrite());
  }

  @Test
  public void write_whenCorpusPathIsValid_whenDataIsValid_expectSuccess()
          throws ExecutionException, InterruptedException {
    final String data = "";
    final String validCorpusPath = "/writeToJson.json";
    localAdapter.writeAsync(validCorpusPath, data).get();

    final File file = new File(localAdapter.createAdapterPath(validCorpusPath));
    if (!file.delete()) {
      throw new RuntimeException("The test is passed, but side file is generated but not cleaned properly.");
    }
  }

  @Test(expectedExceptions = StorageAdapterException.class)
  public void write_whenCorpusPathNotStartWithSlash_expectIsCompletedExceptionally() throws Throwable {
    final String data = "";
    try {
      localAdapter.writeAsync("CORPUS_PATH_NOT_START_WITH_SLASH", data).get();
    } catch (final InterruptedException | ExecutionException e) {
      throw e.getCause();
    }
  }

  // TODO-BQ: Validate test.
  @Test
  public void dirExists_whenFolderPathIsEmptyString_returnTrue()
          throws ExecutionException, InterruptedException {
    assertTrue(localAdapter.dirExists("").get());
  }

  // TODO-BQ: Validate test.
  @Test
  public void dirExists_whenFolderPathIsSlash_returnTrue()
          throws ExecutionException, InterruptedException {
    assertTrue(localAdapter.dirExists("/").get());
  }

  // TODO-BQ: Validate test.
  @Test
  public void dirExists_whenFolderPathIsSlashInner_returnTrue()
          throws ExecutionException, InterruptedException {
    assertTrue(localAdapter.dirExists("/inner").get());
  }

  // TODO-BQ: Validate test.
  @Test
  public void dirExists_whenFolderPathIsSlashInnerSlash_returnTrue()
          throws ExecutionException, InterruptedException {
    assertTrue(localAdapter.dirExists("/inner/").get());
  }

  @Test
  public void dirExists_whenFolderPathNotExist_returnFalse()
          throws ExecutionException, InterruptedException {
    assertFalse(localAdapter.dirExists("PATH_NOT_EXIST").get());
  }

  @Test
  public void dirExists_whenFolderPathIsMalformed_returnFalse()
          throws ExecutionException, InterruptedException {
    assertFalse(localAdapter.dirExists("/m&l.form").get());
  }
}
