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

  ImportPriorities() {
    this.importPriority = new LinkedHashMap<>();
    this.monikerPriorityMap = new LinkedHashMap<>();
  }

  public ImportPriorities copy() {
    final ImportPriorities copy = new ImportPriorities();
    this.importPriority.forEach(copy.importPriority::put);
    this.monikerPriorityMap.forEach(copy.monikerPriorityMap::put);
    return copy;
  }

  Map<String, CdmDocumentDefinition> getMonikerPriorityMap() {
    return monikerPriorityMap;
  }

  Map<CdmDocumentDefinition, Integer> getImportPriority() {
    return importPriority;
  }
}
