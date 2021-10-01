// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.storage.StorageAdapter;
import com.microsoft.commondatamodel.objectmodel.storage.StorageAdapterBase;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.TimeUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.VisitCallback;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

public class CdmLocalEntityDeclarationDefinition extends CdmObjectDefinitionBase implements
    CdmEntityDeclarationDefinition {

  private static final String TAG = CdmLocalEntityDeclarationDefinition.class.getSimpleName();

  public String entityName;
  public String entityPath;
  public String prefixPath;
  public OffsetDateTime lastFileStatusCheckTime;
  public OffsetDateTime lastFileModifiedTime;
  public OffsetDateTime lastFileModifiedOldTime;
  public OffsetDateTime lastChildFileModifiedTime;
  private CdmCollection<CdmDataPartitionDefinition> dataPartitions;
  private CdmCollection<CdmDataPartitionPatternDefinition> dataPartitionPatterns;

  public CdmLocalEntityDeclarationDefinition(final CdmCorpusContext ctx, final String entityName) {
    super(ctx);
    this.setObjectType(CdmObjectType.LocalEntityDeclarationDef);
    this.setEntityName(entityName);
    this.dataPartitions =
        new CdmCollection<>(this.getCtx(), this, CdmObjectType.DataPartitionDef);
    this.dataPartitionPatterns =
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

  @Override
  public CompletableFuture<Void> fileStatusCheckAsync() {
    return CompletableFuture.runAsync(() -> {
      StorageAdapter storageAdapterInterface = this.getCtx().getCorpus().getStorage().fetchAdapter(this.getInDocument().getNamespace()); 
      StorageAdapterBase.CacheContext cacheContext = null;
      if(storageAdapterInterface instanceof StorageAdapterBase) {
        cacheContext = ((StorageAdapterBase)storageAdapterInterface).createFileQueryCacheContext();
      }      
      try {
        final String fullPath =
            this.getCtx()
                .getCorpus()
                .getStorage()
                .createAbsoluteCorpusPath(this.getEntityPath(), this.getInDocument());
        final OffsetDateTime modifiedTime = getCtx()
            .getCorpus()
            .computeLastModifiedTimeAsync(fullPath, this)
            .join();

        for (final CdmDataPartitionPatternDefinition pattern : getDataPartitionPatterns()) {
          pattern.fileStatusCheckAsync().join();
        }

        for (final CdmDataPartitionDefinition partition : getDataPartitions()) {
            partition.fileStatusCheckAsync().join();
        }

        // update modified times
        setLastFileStatusCheckTime(OffsetDateTime.now(ZoneOffset.UTC));
        setLastFileModifiedTime(TimeUtils.maxTime(modifiedTime, getLastFileModifiedTime()));

        reportMostRecentTimeAsync(getLastFileModifiedTime()).join();
      }
      finally {
        if(cacheContext != null)
        {
          cacheContext.dispose();
        }
      }
    });
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



  @Override
  public Object copyData(final ResolveOptions resOpt, final CopyOptions options) {
    return CdmObjectBase.copyData(this, resOpt, options, CdmLocalEntityDeclarationDefinition.class);
  }

  /**
   *
   * @param resOpt Resolved optoions
   * @param host Host
   * @return CDM Object
   * @deprecated CopyData is deprecated. Please use the Persistence Layer instead. This function is
   * extremely likely to be removed in the public interface, and not meant to be called externally
   * at all. Please refrain from using it.
   */
  @Override
  @Deprecated
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
    }

    copy.setEntityPath(this.getEntityPath());
    copy.setLastFileStatusCheckTime(this.getLastFileStatusCheckTime());
    copy.setLastFileModifiedTime(this.getLastFileModifiedTime());
    copy.setLastChildFileModifiedTime(this.getLastChildFileModifiedTime());

    for (final CdmDataPartitionDefinition dataPartition : this.getDataPartitions()) {
      copy.getDataPartitions().add((CdmDataPartitionDefinition) dataPartition.copy(resOpt));
    }

    for (final CdmDataPartitionPatternDefinition dataPartitionPattern : this.getDataPartitionPatterns()) {
      copy.getDataPartitionPatterns().add((CdmDataPartitionPatternDefinition) dataPartitionPattern.copy(resOpt));
    }

    this.copyDef(resOpt, copy);

    return copy;
  }

  /**
   * Creates a data partition object using the input, should be called by CdmDataPartitionPatternDefinition object.
   */
  void createDataPartitionFromPattern(
      final String filePath,
      final CdmTraitCollection exhibitsTraits,
      final Map<String, List<String>> args,
      final String schema,
      final OffsetDateTime modifiedTime) {
    final Optional<CdmDataPartitionDefinition> existingPartition =
            getDataPartitions().getAllItems().stream().filter(x -> x.getLocation().equals(filePath)).findFirst();

    if (!existingPartition.isPresent()) {
      final CdmDataPartitionDefinition newPartition = getCtx().getCorpus().makeObject(CdmObjectType.DataPartitionDef);

      newPartition.setLocation(filePath);
      newPartition.setSpecializedSchema(schema);
      newPartition.setLastFileModifiedTime(modifiedTime);
      newPartition.setLastFileStatusCheckTime(OffsetDateTime.now(ZoneOffset.UTC));

      for (final CdmTraitReferenceBase trait : exhibitsTraits) {
        newPartition.getExhibitsTraits().add(trait);
      }

      for (final Map.Entry<String, List<String>> entry : args.entrySet()) {
        newPartition.getArguments().put(entry.getKey(), entry.getValue());
      }

      this.dataPartitions.add(newPartition);
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
