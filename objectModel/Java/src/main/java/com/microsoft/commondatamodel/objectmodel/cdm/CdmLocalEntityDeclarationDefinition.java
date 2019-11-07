// Copyright (c) Microsoft Corporation.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.TimeUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.VisitCallback;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

public class CdmLocalEntityDeclarationDefinition extends CdmObjectDefinitionBase implements
    CdmEntityDeclarationDefinition {

  public String entityName;
  public String entityPath;
  public CdmCollection<CdmDataPartitionDefinition> dataPartitions;
  public CdmCollection<CdmDataPartitionPatternDefinition> dataPartitionPatterns;
  public String prefixPath;
  public OffsetDateTime lastFileStatusCheckTime;
  public OffsetDateTime lastFileModifiedTime;
  public OffsetDateTime lastChildFileModifiedTime;

  public CdmLocalEntityDeclarationDefinition(final CdmCorpusContext ctx, final String entityName) {
    super(ctx);
    this.setObjectType(CdmObjectType.LocalEntityDeclarationDef);
    this.setEntityName(entityName);
  }

  @Override
  public String getName() {
    return this.getEntityName();
  }

  @Override
  public boolean isDerivedFrom(final ResolveOptions resOpt, final String baseDef) {
    // Intended to return false
    return false;
  }

  @Override
  public boolean visit(final String pathFrom, final VisitCallback preChildren, final VisitCallback postChildren) {
    String path = this.getDeclaredPath();
    if (path == null) {
      path = pathFrom + this.getEntityName();
      this.setDeclaredPath(path);
    }

    if (preChildren != null && preChildren.invoke(this, path)) {
      return false;
    }

    return this.getDataPartitions() != null && this.getDataPartitions()
        .visitList(path + "/", preChildren, postChildren);
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
   * @return
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public CdmCollection<CdmDataPartitionDefinition> getDataPartitions() {
    if (this.dataPartitions == null) {
      this.dataPartitions = new CdmCollection(this.getCtx(), this, CdmObjectType.DataPartitionDef);
    }
    return this.dataPartitions;
  }

  /**
   * Gets the data partition patterns.
   * @return
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public CdmCollection<CdmDataPartitionPatternDefinition> getDataPartitionPatterns() {
    if (this.dataPartitionPatterns == null) {
      this.dataPartitionPatterns = new CdmCollection(this.getCtx(), this,
          CdmObjectType.DataPartitionPatternDef);
    }
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
    this.lastFileModifiedTime = value;
  }

  @Override
  public CompletableFuture<Void> fileStatusCheckAsync() {
    return CompletableFuture.runAsync(() -> {
      final OffsetDateTime modifiedTime = getCtx().getCorpus().computeLastModifiedTimeAsync(getEntityPath()).join();

      for (final CdmDataPartitionDefinition partition : getDataPartitions()) {
          partition.fileStatusCheckAsync().join();
      }

      for (final CdmDataPartitionPatternDefinition pattern : getDataPartitionPatterns()) {
          pattern.fileStatusCheckAsync().join();
      }

      // update modified times
      setLastFileStatusCheckTime(OffsetDateTime.now(ZoneOffset.UTC));
      setLastFileModifiedTime(TimeUtils.maxTime(modifiedTime, getLastFileModifiedTime()));

      reportMostRecentTimeAsync(getLastFileModifiedTime()).join();
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
    return !StringUtils.isNullOrTrimEmpty(this.entityName);
  }



  @Override
  public Object copyData(final ResolveOptions resOpt, final CopyOptions options) {
    return CdmObjectBase.copyData(this, resOpt, options, CdmLocalEntityDeclarationDefinition.class);
  }

  /**
   *
   * @param resOpt
   * @return
   * @deprecated CopyData is deprecated. Please use the Persistence Layer instead. This function is
   * extremely likely to be removed in the public interface, and not meant to be called externally
   * at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public CdmObject copy(final ResolveOptions resOpt) {
    final CdmLocalEntityDeclarationDefinition copy = new CdmLocalEntityDeclarationDefinition(this.getCtx(),
        this.getEntityName());

    copy.setEntityPath(this.getEntityPath());
    copy.setLastFileStatusCheckTime(this.getLastFileStatusCheckTime());
    copy.setLastFileModifiedTime(this.getLastFileModifiedTime());
    copy.setLastChildFileModifiedTime(this.getLastChildFileModifiedTime());

    for (final CdmDataPartitionDefinition dataPartition : this.getDataPartitions()) {
      copy.getDataPartitions().add(dataPartition);
    }

    for (final CdmDataPartitionPatternDefinition dataPartitionPattern : this.getDataPartitionPatterns()) {
      copy.getDataPartitionPatterns().add(dataPartitionPattern);
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

      for (final CdmTraitReference trait : exhibitsTraits) {
        newPartition.getExhibitsTraits().add(trait);
      }

      for (final Map.Entry<String, List<String>> entry : args.entrySet()) {
        newPartition.getArguments().put(entry.getKey(), entry.getValue());
      }

      getDataPartitions().add(newPartition);
    }
  }
}
