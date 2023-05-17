// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.storage;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.concurrent.CompletableFuture;

import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;

/**
 * An adapter pre-configured to read the standard schema files published by CDM.
 */
public class CdmCustomPackageAdapter extends StorageAdapterBase {

  final Class packageObject;

  final Method packageReadAsync;

  /**
   * Constructs a CdmStandardsAdapter with default parameters.
   */
  public CdmCustomPackageAdapter(String packageName) throws ClassNotFoundException {
    if (StringUtils.isNullOrTrimEmpty(packageName)) {
      throw new ClassNotFoundException("No package name passed in, please pass in a package name or package when constructing the CdmCustomPackageAdapter.");
    }

    try {
      this.packageObject = Class.forName(packageName);
      this.packageReadAsync = packageObject.getMethod("readAsync", String.class);
    } catch (ClassNotFoundException|NoSuchMethodException e) {
      throw new ClassNotFoundException(String.format("Couldn't find package '%s', please install the package, and add it as dependency of the project.", packageName));
    }
  }

  public CdmCustomPackageAdapter(Class packageObject) throws ClassNotFoundException {
    if (packageObject == null) {
      throw new ClassNotFoundException("No package passed in, please pass in a package name or package when constructing the CdmCustomPackageAdapter.");
    }

    this.packageObject = packageObject;

    try {
      this.packageReadAsync = packageObject.getMethod("readAsync", String.class);
    } catch (NoSuchMethodException e) {
      throw new ClassNotFoundException(String.format("Couldn't find package '%s', please install the package, and add it as dependency of the project.", packageObject.getName()));
    }
  }

  @Override
  public boolean canRead() {
    return true;
  }

  @Override
  public CompletableFuture<String> readAsync(final String corpusPath) throws StorageAdapterException {
    return CompletableFuture.supplyAsync(() -> {
      final String adapterPath = this.createAdapterPath(corpusPath);
      try {
        return (String)this.packageReadAsync.invoke(null, adapterPath);
      } catch (IllegalAccessException e) {
        throw new StorageAdapterException(e.getMessage());
      } catch (InvocationTargetException e) {
        throw new StorageAdapterException(e.getCause().getMessage());
      }
    });
  }

  @Override
  public String createAdapterPath(final String corpusPath) {
    return corpusPath;
  }

  @Override
  public String createCorpusPath(final String adapterPath) {
    return adapterPath;
  }
}
