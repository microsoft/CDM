// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * @deprecated This class is extremely likely to be removed in the public interface, and not meant
 * to be called externally at all. Please refrain from using it.
 */
@Deprecated
public class ImportPriorities {
  private final Map<CdmDocumentDefinition, Integer> importPriority;
  private final Map<String, CdmDocumentDefinition> monikerPriorityMap;
  private boolean hasCircularImport;

  ImportPriorities() {
    this.importPriority = new LinkedHashMap<>();
    this.monikerPriorityMap = new LinkedHashMap<>();
    this.hasCircularImport = false;
  }

  public ImportPriorities copy() {
    final ImportPriorities copy = new ImportPriorities();
    if (this.importPriority != null) {
      this.importPriority.forEach(copy.importPriority::put);
    }

    if (this.monikerPriorityMap != null) {
      this.monikerPriorityMap.forEach(copy.monikerPriorityMap::put);
    }

    copy.hasCircularImport = this.hasCircularImport;
    return copy;
  }

  Map<String, CdmDocumentDefinition> getMonikerPriorityMap() {
    return monikerPriorityMap;
  }

  Map<CdmDocumentDefinition, Integer> getImportPriority() {
    return importPriority;
  }

  boolean getHasCircularImport() {
    return hasCircularImport;
  }

  void setHasCircularImport(boolean value) {
    this.hasCircularImport = value;
  }
}
