// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.enums.*;
import com.microsoft.commondatamodel.objectmodel.storage.StorageAdapterBase;
import com.microsoft.commondatamodel.objectmodel.utilities.Constants;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.FileStatusCheckOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.TimeUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.VisitCallback;
import com.microsoft.commondatamodel.objectmodel.utilities.exceptions.CdmReadPartitionFromPatternException;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;
import jdk.jshell.spi.ExecutionControlProvider;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;
import java.util.stream.Collectors;

public class CdmLocalEntityDeclarationDefinition extends CdmObjectDefinitionBase implements
    CdmEntityDeclarationDefinition {

  private static final String TAG = CdmLocalEntityDeclarationDefinition.class.getSimpleName();

  public String entityName;
  public String entityPath;
  public OffsetDateTime lastFileStatusCheckTime;
  public OffsetDateTime lastFileModifiedTime;
  public OffsetDateTime lastFileModifiedOldTime;
  public OffsetDateTime lastChildFileModifiedTime;
  private CdmCollection<CdmDataPartitionDefinition> dataPartitions;
  private CdmCollection<CdmDataPartitionPatternDefinition> dataPartitionPatterns;
  private CdmCollection<CdmDataPartitionDefinition> incrementalPartitions;
  private CdmCollection<CdmDataPartitionPatternDefinition> incrementalPartitionPatterns;
  private String virtualLocation;

  public CdmLocalEntityDeclarationDefinition(final CdmCorpusContext ctx, final String entityName) {
    super(ctx);
    this.setObjectType(CdmObjectType.LocalEntityDeclarationDef);
    this.setEntityName(entityName);
    this.dataPartitions =
        new CdmCollection<>(this.getCtx(), this, CdmObjectType.DataPartitionDef);
    this.dataPartitionPatterns =
        new CdmCollection<>(this.getCtx(), this, CdmObjectType.DataPartitionPatternDef);
    this.incrementalPartitions =
            new CdmCollection<>(this.getCtx(), this, CdmObjectType.DataPartitionDef);
    this.incrementalPartitionPatterns =
            new CdmCollection<>(this.getCtx(), this, CdmObjectType.DataPartitionPatternDef);
    this.lastFileModifiedOldTime = null;
    this.lastFileModifiedTime = null;
  }

  @Override
  public String getName() {
    return this.getEntityName();
  }

  @Override
  public boolean isDerivedFrom(final String baseDef, ResolveOptions resOpt) {
    return false;
  }

  @Override
  public boolean visit(final String pathFrom, final VisitCallback preChildren, final VisitCallback postChildren) {
    String path = this.fetchDeclaredPath(pathFrom);

    if (preChildren != null && preChildren.invoke(this, path)) {
      return false;
    }

    if (this.dataPartitions != null && this.dataPartitions
        .visitList(path + "/dataPartitions/", preChildren, postChildren)) {
      return true;
    }

    if (this.dataPartitionPatterns != null) {
      if (this.dataPartitionPatterns.visitList(
          path + "/dataPartitionPatterns/",
          preChildren,
          postChildren)) {
        return true;
      }
    }

    if (this.incrementalPartitions != null && this.incrementalPartitions
            .visitList(path + "/incrementalPartitions/", preChildren, postChildren)) {
      return true;
    }

    if (this.incrementalPartitionPatterns != null) {
      if (this.incrementalPartitionPatterns.visitList(
              path + "/incrementalPartitionPatterns/",
              preChildren,
              postChildren)) {
        return true;
      }
    }

    if (this.visitDef(path, preChildren, postChildren)) {
      return true;
    }

    if (postChildren != null && postChildren.invoke(this, path)) {
      return true;
    }

    return false;
  }

  /**
   * Gets or sets the entity schema.
   */
  @Override
  public String getEntityPath() {
    return this.entityPath;
  }

  @Override
  public void setEntityPath(final String value) {
    this.entityPath = value;
  }

  /**
   * Gets the data partitions.
   */
  @Override
  public CdmCollection<CdmDataPartitionDefinition> getDataPartitions() {
    return this.dataPartitions;
  }

  /**
   * Gets the data partition patterns.
   */
  @Override
  public CdmCollection<CdmDataPartitionPatternDefinition> getDataPartitionPatterns() {
    return this.dataPartitionPatterns;
  }

  /**
   * Gets the incremental partitions.
   */
  @Override
  public CdmCollection<CdmDataPartitionDefinition> getIncrementalPartitions() {
    return this.incrementalPartitions;
  }

  /**
   * Gets the data partition patterns.
   */
  @Override
  public CdmCollection<CdmDataPartitionPatternDefinition> getIncrementalPartitionPatterns() {
    return this.incrementalPartitionPatterns;
  }

  /**
   * Gets or sets the entity name.
   */
  @Override
  public String getEntityName() {
    return this.entityName;
  }

  @Override
  public void setEntityName(final String value) {
    this.entityName = value;
  }

  /**
   * Gets or sets the attribute context content list.
   */
  @Override
  public OffsetDateTime getLastChildFileModifiedTime() {
    return this.lastChildFileModifiedTime;
  }

  @Override
  public void setLastChildFileModifiedTime(final OffsetDateTime value) {
    this.lastChildFileModifiedTime = value;
  }

  /**
   * Last time the modified times were updated.
   */
  @Override
  public OffsetDateTime getLastFileStatusCheckTime() {
    return this.lastFileStatusCheckTime;
  }

  @Override
  public void setLastFileStatusCheckTime(final OffsetDateTime value) {
    this.lastFileStatusCheckTime = value;
  }

  /**
   * Last time this file was modified according to the OM.
   */
  @Override
  public OffsetDateTime getLastFileModifiedTime() {
    return this.lastFileModifiedTime;
  }

  @Override
  public void setLastFileModifiedTime(final OffsetDateTime value) {
    this.setlastFileModifiedOldTime(this.lastFileModifiedTime);
    this.lastFileModifiedTime = value;
  }

  public OffsetDateTime getlastFileModifiedOldTime() {
    return this.lastFileModifiedOldTime;
  }

  private void setlastFileModifiedOldTime(OffsetDateTime value) {
    this.lastFileModifiedOldTime = value;
  }

  /**
   * Gets this entity's virtual location, it's model.json file's location if entity is from a model.json file
   *
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   * @return String
   */
  @Deprecated
  public String getVirtualLocation() { return this.virtualLocation; }

  /**
   * Sets this entity's virtual location, it's model.json file's location if entity is from a model.json file
   *
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public void setVirtualLocation(final String virtualLocation) {
    this.virtualLocation = virtualLocation;
  }

  /**
   * Gets whether this entity is virtual, which means it's coming from model.json file.
   *
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   * @return boolean
   */
  public boolean isVirtual() {
    return !StringUtils.isNullOrTrimEmpty(this.virtualLocation);
  }

  @Override
  public CompletableFuture<Void> fileStatusCheckAsync() throws CdmReadPartitionFromPatternException {
    return fileStatusCheckAsync(PartitionFileStatusCheckType.Full);
  }

  public CompletableFuture<Void> fileStatusCheckAsync(final PartitionFileStatusCheckType partitionFileStatusCheckType) throws CdmReadPartitionFromPatternException {
    return fileStatusCheckAsync(partitionFileStatusCheckType, CdmIncrementalPartitionType.None);
  }

  public CompletableFuture<Void> fileStatusCheckAsync(final PartitionFileStatusCheckType partitionFileStatusCheckType, final CdmIncrementalPartitionType incrementalType) throws CdmReadPartitionFromPatternException {
    return fileStatusCheckAsync(partitionFileStatusCheckType, incrementalType, null);
  }

  public CompletableFuture<Void> fileStatusCheckAsync(final PartitionFileStatusCheckType partitionFileStatusCheckType, final CdmIncrementalPartitionType incrementalType, final FileStatusCheckOptions fileStatusCheckOptions) throws CdmReadPartitionFromPatternException {
    return CompletableFuture.runAsync(() -> {
      StorageAdapterBase adapter = this.getCtx().getCorpus().getStorage().fetchAdapter(this.getInDocument().getNamespace());
      StorageAdapterBase.CacheContext cacheContext = null;
      if (adapter != null) {
        cacheContext = adapter.createFileQueryCacheContext();
      }
      try {
        final String fullPath = this.getCtx()
                .getCorpus()
                .getStorage()
                .createAbsoluteCorpusPath(this.getEntityPath(), this.getInDocument());
        OffsetDateTime modifiedTime = this.isVirtual() ? this.getCtx().getCorpus().getLastModifiedTimeFromObjectAsync(this).join()
                                                       : this.getCtx().getCorpus().computeLastModifiedTimeAsync(fullPath, this).join();

        // check patterns first as this is a more performant way of querying file modification times
        // from ADLS and we can cache the times for reuse in the individual partition checks below
        if (partitionFileStatusCheckType == PartitionFileStatusCheckType.Full || partitionFileStatusCheckType == PartitionFileStatusCheckType.FullAndIncremental) {
          for (final CdmDataPartitionPatternDefinition pattern : getDataPartitionPatterns()) {
            if (pattern.isIncremental()) {
              Logger.error(pattern.getCtx(), TAG, "fileStatusCheckAsync", pattern.getAtCorpusPath(), CdmLogCode.ErrUnexpectedIncrementalPartitionTrait,
                      pattern.getClass().getSimpleName(), pattern.fetchObjectDefinitionName(), Constants.IncrementalTraitName, "dataPartitionPatterns");
            } else {
              pattern.fileStatusCheckAsync(fileStatusCheckOptions).join();
            }
          }
          for (final CdmDataPartitionDefinition partition : getDataPartitions()) {
            if (partition.isIncremental()) {
              Logger.error(partition.getCtx(), TAG, "fileStatusCheckAsync", partition.getAtCorpusPath(), CdmLogCode.ErrUnexpectedIncrementalPartitionTrait,
                      partition.getClass().getSimpleName(), partition.fetchObjectDefinitionName(), Constants.IncrementalTraitName, "dataPartitions");
            } else {
              partition.fileStatusCheckAsync(fileStatusCheckOptions).join();
            }
          }
        }

        if (partitionFileStatusCheckType == PartitionFileStatusCheckType.Incremental || partitionFileStatusCheckType == PartitionFileStatusCheckType.FullAndIncremental) {
          for (final CdmDataPartitionPatternDefinition pattern : getIncrementalPartitionPatterns()) {
            if (this.shouldCallFileStatusCheck(incrementalType, true, pattern)) {
              pattern.fileStatusCheckAsync().join();
            }
          }
          for (final CdmDataPartitionDefinition partition : getIncrementalPartitions()) {
            if (this.shouldCallFileStatusCheck(incrementalType, false, partition)) {
              partition.fileStatusCheckAsync().join();
            }
          }
        }

        // update modified times
        setLastFileStatusCheckTime(OffsetDateTime.now(ZoneOffset.UTC));
        setLastFileModifiedTime(TimeUtils.maxTime(modifiedTime, getLastFileModifiedTime()));

        reportMostRecentTimeAsync(getLastFileModifiedTime()).join();
      } finally {
        if (cacheContext != null) {
          cacheContext.dispose();
        }
      }
    });
  }

  /**
   *
   * Determine if calling FileStatusCheckAsync on the given pattern or the given partition is needed.
   * @param incrementalType The incremental type.
   * @param isPattern Whether the object is a pattern object or a partition object.
   * @param patternOrPartitionObj The pattern object if isPattern is true, otherwise the partition object.
   *
   */
  private boolean shouldCallFileStatusCheck(final CdmIncrementalPartitionType incrementalType, final boolean isPattern, final CdmObjectDefinitionBase patternOrPartitionObj) {
    boolean update = true;

    CdmTraitReference traitRef = (CdmTraitReference)patternOrPartitionObj.getExhibitsTraits().item(Constants.IncrementalTraitName);
    if (traitRef == null) {
      Logger.error(patternOrPartitionObj.getCtx(), TAG, "shouldCallFileStatusCheck", patternOrPartitionObj.getAtCorpusPath(), CdmLogCode.ErrMissingIncrementalPartitionTrait,
              patternOrPartitionObj.getClass().getSimpleName(), patternOrPartitionObj.fetchObjectDefinitionName(),
              Constants.IncrementalTraitName, isPattern ? "incrementalPartitionPatterns" : "incrementalPartitions");
    } else {
      // None means update by default
      if (incrementalType == CdmIncrementalPartitionType.None) {
        return update;
      }
      final Object traitRefIncrementalTypeValue = traitRef.getArguments() != null ? traitRef.getArguments().fetchValue("type") : null;
      if (traitRefIncrementalTypeValue == null) {
        update = false;
        Logger.error(patternOrPartitionObj.getCtx(), TAG, "shouldCallFileStatusCheck", patternOrPartitionObj.getAtCorpusPath(), CdmLogCode.ErrTraitArgumentMissing,
                "type", Constants.IncrementalTraitName, patternOrPartitionObj.fetchObjectDefinitionName());
      } else if (!(traitRefIncrementalTypeValue instanceof String)) {
        update = false;
        Logger.error(patternOrPartitionObj.getCtx(), TAG, "shouldCallFileStatusCheck", patternOrPartitionObj.getAtCorpusPath(), CdmLogCode.ErrTraitInvalidArgumentValueType,
                "type", Constants.IncrementalTraitName, patternOrPartitionObj.fetchObjectDefinitionName());
      } else {
        final String endpointStr = traitRefIncrementalTypeValue.toString();
        CdmIncrementalPartitionType traitRefIncrementalType;
        try {
          traitRefIncrementalType = CdmIncrementalPartitionType.valueOf(traitRefIncrementalTypeValue.toString());
          update = traitRefIncrementalType == incrementalType;
        } catch (IllegalArgumentException ex) {
          update = false;
          Logger.error(patternOrPartitionObj.getCtx(), TAG, "shouldCallFileStatusCheck", patternOrPartitionObj.getAtCorpusPath(), CdmLogCode.ErrEnumConversionFailure,
                  (String) traitRefIncrementalTypeValue, "CdmIncrementalPartitionType",
                  "parameter 'type' of trait '" + Constants.IncrementalTraitName + "' from '" + patternOrPartitionObj.fetchObjectDefinitionName() + "'");
        }
      }
    }

    return update;
  }

  @Override
  public CompletableFuture<Void> reportMostRecentTimeAsync(final OffsetDateTime childTime) {
      setLastChildFileModifiedTime(childTime);

      final OffsetDateTime mostRecentAtThisLevel = TimeUtils.maxTime(childTime, getLastFileModifiedTime());

    if (getOwner() instanceof CdmFileStatus && mostRecentAtThisLevel != null) {
      return ((CdmFileStatus) getOwner()).reportMostRecentTimeAsync(mostRecentAtThisLevel);
      }

      return CompletableFuture.completedFuture(null);
  }

  @Override
  public boolean validate() {
    if (StringUtils.isNullOrTrimEmpty(this.entityName)) {
      ArrayList<String> missingFields = new ArrayList<String>(Arrays.asList("entityName"));
      Logger.error(this.getCtx(), TAG, "validate", this.getAtCorpusPath(), CdmLogCode.ErrValdnIntegrityCheckFailure, this.getAtCorpusPath(), String.join(", ", missingFields.parallelStream().map((s) -> { return String.format("'%s'", s);}).collect(Collectors.toList())));
      return false;
    }
    return true;
  }

  /**
   *
   * @param resOpt Resolved optoions
   * @param options CopyOptions
   * @return CDM Object
   * @deprecated CopyData is deprecated. Please use the Persistence Layer instead. This function is
   * extremely likely to be removed in the public interface, and not meant to be called externally
   * at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public Object copyData(final ResolveOptions resOpt, final CopyOptions options) {
    return CdmObjectBase.copyData(this, resOpt, options, CdmLocalEntityDeclarationDefinition.class);
  }

  @Override
  public CdmObject copy(ResolveOptions resOpt, CdmObject host) {
    if (resOpt == null) {
      resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
    }

    CdmLocalEntityDeclarationDefinition copy;
    if (host == null) {
      copy = new CdmLocalEntityDeclarationDefinition(this.getCtx(), this.getEntityName());
    } else {
      copy = (CdmLocalEntityDeclarationDefinition) host;
      copy.setCtx(this.getCtx());
      copy.setEntityName(this.getEntityName());
      copy.getDataPartitions().clear();
      copy.getDataPartitionPatterns().clear();
      copy.getIncrementalPartitions().clear();
      copy.getIncrementalPartitionPatterns().clear();
    }

    copy.setEntityPath(this.getEntityPath());
    copy.setLastFileStatusCheckTime(this.getLastFileStatusCheckTime());
    copy.setLastFileModifiedTime(this.getLastFileModifiedTime());
    copy.setLastChildFileModifiedTime(this.getLastChildFileModifiedTime());
    copy.setVirtualLocation(this.getVirtualLocation());

    for (final CdmDataPartitionDefinition dataPartition : this.getDataPartitions()) {
      copy.getDataPartitions().add((CdmDataPartitionDefinition) dataPartition.copy(resOpt));
    }

    for (final CdmDataPartitionPatternDefinition dataPartitionPattern : this.getDataPartitionPatterns()) {
      copy.getDataPartitionPatterns().add((CdmDataPartitionPatternDefinition) dataPartitionPattern.copy(resOpt));
    }

    for (final CdmDataPartitionDefinition incrementalPartition : this.getIncrementalPartitions()) {
      copy.getIncrementalPartitions().add((CdmDataPartitionDefinition) incrementalPartition.copy(resOpt));
    }

    for (final CdmDataPartitionPatternDefinition incrementalPartitionPattern : this.getIncrementalPartitionPatterns()) {
      copy.getIncrementalPartitionPatterns().add((CdmDataPartitionPatternDefinition) incrementalPartitionPattern.copy(resOpt));
    }

    this.copyDef(resOpt, copy);

    return copy;
  }

  /**
   *
   * Creates a data partition object using the input, should be called by CdmDataPartitionPatternDefinition object.
   * This function doesn't check if the data partition exists.
   *
   * @deprecated createDataPartitionFromPattern is deprecated. Please use the Persistence Layer instead. This function is
   * extremely likely to be removed in the public interface, and not meant to be called externally
   * at all. Please refrain from using it.
   */
  @Deprecated
  void createDataPartitionFromPattern(
      final String filePath,
      final CdmTraitCollection exhibitsTraits,
      final Map<String, List<String>> args,
      final String schema,
      final OffsetDateTime modifiedTime) {
    createDataPartitionFromPattern(filePath, exhibitsTraits, args, schema, modifiedTime, false, null);
  }

  /**
   *
   * Creates a data partition object using the input, should be called by CdmDataPartitionPatternDefinition object.
   * This function doesn't check if the data partition exists.
   *
   * @deprecated createDataPartitionFromPattern is deprecated. Please use the Persistence Layer instead. This function is
   * extremely likely to be removed in the public interface, and not meant to be called externally
   * at all. Please refrain from using it.
   */
  @Deprecated
  void createDataPartitionFromPattern(
          final String filePath,
          final CdmTraitCollection exhibitsTraits,
          final Map<String, List<String>> args,
          final String schema,
          final OffsetDateTime modifiedTime,
          final boolean isIncrementalPartition) {
    createDataPartitionFromPattern(filePath, exhibitsTraits, args, schema, modifiedTime, isIncrementalPartition,null);
  }

  /**
   *
   * @param filePath The file path
   * @param exhibitsTraits The exihibits traits of the caller DataPartitionPattern object.
   * @param args The arguments of capture groups for the regular expression from the caller DataPartitionPattern object.
   * @param schema The specialized schema.
   * @param modifiedTime The last modified time.
   * @param incrementPartitionPatternName The name of caller DataPartitionPattern object if this is an incremental partition.
   * Creates a data partition object using the input, should be called by CdmDataPartitionPatternDefinition object.
   * This function doesn't check if the data partition exists.
   *
   * @deprecated CopyData is deprecated. Please use the Persistence Layer instead. This function is
   * extremely likely to be removed in the public interface, and not meant to be called externally
   * at all. Please refrain from using it.
   */
  @Deprecated
  void createDataPartitionFromPattern(
          final String filePath,
          final CdmTraitCollection exhibitsTraits,
          final Map<String, List<String>> args,
          final String schema,
          final OffsetDateTime modifiedTime,
          final boolean isIncrementalPartition,
          final String incrementPartitionPatternName) {
      final CdmDataPartitionDefinition newPartition = getCtx().getCorpus().makeObject(CdmObjectType.DataPartitionDef);

      newPartition.setLocation(filePath);
      newPartition.setSpecializedSchema(schema);
      newPartition.setLastFileModifiedTime(modifiedTime);
      newPartition.setLastFileStatusCheckTime(OffsetDateTime.now(ZoneOffset.UTC));

      for (final CdmTraitReferenceBase trait : exhibitsTraits) {
        newPartition.getExhibitsTraits().add((CdmTraitReferenceBase) trait.copy());
      }

      for (final Map.Entry<String, List<String>> entry : args.entrySet()) {
        newPartition.getArguments().put(entry.getKey(), entry.getValue());
      }

      if(!isIncrementalPartition) {
        this.dataPartitions.add(newPartition);
      } else {
        if (!StringUtils.isNullOrTrimEmpty(incrementPartitionPatternName)) {
          ((CdmTraitReference)newPartition.getExhibitsTraits().item(Constants.IncrementalTraitName)).getArguments().add(Constants.IncrementalPatternParameterName, incrementPartitionPatternName);
        }
        this.incrementalPartitions.add(newPartition);
      }
  }

  /**
   * Reset LastFileModifiedOldTime.
   */
  public void resetLastFileModifiedOldTime()
  {
      this.setlastFileModifiedOldTime(null);
  }
}
