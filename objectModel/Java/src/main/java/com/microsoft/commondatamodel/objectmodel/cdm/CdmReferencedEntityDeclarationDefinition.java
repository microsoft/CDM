// Copyright (c) Microsoft Corporation.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttributeSetBuilder;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedTraitSetBuilder;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.TimeUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.VisitCallback;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.concurrent.CompletableFuture;

public class CdmReferencedEntityDeclarationDefinition extends CdmObjectDefinitionBase implements
    CdmEntityDeclarationDefinition {

  private String entityName;
  private String entitySchema;
  private OffsetDateTime lastFileStatusCheckTime;
  private OffsetDateTime lastFileModifiedTime;
  private OffsetDateTime lastChildFileModifiedTime;

  public CdmReferencedEntityDeclarationDefinition(final CdmCorpusContext ctx, final String entityName) {
    super(ctx);
    this.setObjectType(CdmObjectType.ReferencedEntityDeclarationDef);
    this.setEntityName(entityName);
  }

  @Override
  public String getEntityName() {
    return entityName;
  }

  @Override
  public void setEntityName(final String entityName) {
    this.entityName = entityName;
  }

  @Override
  public String getEntityPath() {
    return this.entitySchema;
  }

  @Override
  public void setEntityPath(final String value) {
    this.entitySchema = value;
  }

  @Override
  public OffsetDateTime getLastFileStatusCheckTime() {
    return lastFileStatusCheckTime;
  }

  @Override
  public void setLastFileStatusCheckTime(final OffsetDateTime lastFileStatusCheckTime) {
    this.lastFileStatusCheckTime = lastFileStatusCheckTime;
  }

  @Override
  public OffsetDateTime getLastFileModifiedTime() {
    return lastFileModifiedTime;
  }

  @Override
  public void setLastFileModifiedTime(final OffsetDateTime lastFileModifiedTime) {
    this.lastFileModifiedTime = lastFileModifiedTime;
  }

  @Override
  public OffsetDateTime getLastChildFileModifiedTime() {
    return lastChildFileModifiedTime;
  }

  @Override
  public void setLastChildFileModifiedTime(final OffsetDateTime lastChildFileModifiedTime) {
    this.lastChildFileModifiedTime = lastChildFileModifiedTime;
  }

  @Override
  public String getName() {
    return this.getEntityName();
  }

  @Override
  public boolean isDerivedFrom(final String baseDef, final ResolveOptions resOpt) {
    // Intended to return false.
    return false;
  }

  @Override
  public boolean visit(final String pathRoot, final VisitCallback preChildren, final VisitCallback postChildren) {
    // Intended to return false.
    return false;
  }

  @Override
  public CompletableFuture<Void> fileStatusCheckAsync() {
    return CompletableFuture.runAsync(() -> {
      final String fullPath =
          this.getCtx()
              .getCorpus()
              .getStorage()
              .createAbsoluteCorpusPath(this.getEntityPath(), this.getInDocument());

      final OffsetDateTime modifiedTime =
          this.getCtx().getCorpus().computeLastModifiedTimeAsync(fullPath, this).join();

      // update modified times
      setLastFileStatusCheckTime(OffsetDateTime.now(ZoneOffset.UTC));
      setLastFileModifiedTime(TimeUtils.maxTime(modifiedTime, getLastFileModifiedTime()));

      reportMostRecentTimeAsync(getLastFileModifiedTime()).join();
    });
  }

  @Override
  public CompletableFuture<Void> reportMostRecentTimeAsync(final OffsetDateTime childTime) {
    if (getOwner() instanceof CdmFileStatus && childTime != null) {
      return ((CdmFileStatus) getOwner()).reportMostRecentTimeAsync(childTime);
    }

    return CompletableFuture.completedFuture(null);
  }

  @Override
  public boolean validate() {
    return !StringUtils.isNullOrTrimEmpty(this.getEntityName()) && !StringUtils.isNullOrTrimEmpty(this.getEntityPath());
  }

  /**
   *
   * @param resOpt
   * @param options
   * @return
   * @deprecated CopyData is deprecated. Please use the Persistence Layer instead. This function is
   * extremely likely to be removed in the public interface, and not meant to be called externally
   * at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public Object copyData(final ResolveOptions resOpt, final CopyOptions options) {
    return CdmObjectBase.copyData(this, resOpt, options, CdmReferencedEntityDeclarationDefinition.class);
  }

  @Override
  public CdmObject copy(ResolveOptions resOpt, CdmObject host) {
    if (resOpt == null) {
      resOpt = new ResolveOptions(this);
    }

    CdmReferencedEntityDeclarationDefinition copy;
    if (host == null) {
      copy = new CdmReferencedEntityDeclarationDefinition(this.getCtx(), this.getEntityName());
    } else {
      copy = (CdmReferencedEntityDeclarationDefinition) host;
      copy.setCtx(this.getCtx());
      copy.setEntityName(this.getEntityName());
    }

    copy.setEntityPath(this.getEntityPath());
    copy.setLastFileStatusCheckTime(this.getLastFileStatusCheckTime());
    copy.setLastFileModifiedTime(this.getLastFileModifiedTime());

    return copy;
  }

  @Override
  ResolvedAttributeSetBuilder constructResolvedAttributes(final ResolveOptions resOpt) {
    return constructResolvedAttributes(resOpt, null);
  }

  @Override
  ResolvedAttributeSetBuilder constructResolvedAttributes(final ResolveOptions resOpt,
                                                          final CdmAttributeContext under) {
    // Intended to return null.
    return null;
  }

  @Override
  void constructResolvedTraits(final ResolvedTraitSetBuilder rtsb, final ResolveOptions resOpt) {
    this.constructResolvedTraitsDef(null, rtsb, resOpt);
  }

  @Override
  public CdmCollection<CdmDataPartitionDefinition> getDataPartitions() {
    // Intended to return null.
    return null;
  }

  @Override
  public CdmCollection<CdmDataPartitionPatternDefinition> getDataPartitionPatterns() {
    // Intended to return null.
    return null;
  }
}
