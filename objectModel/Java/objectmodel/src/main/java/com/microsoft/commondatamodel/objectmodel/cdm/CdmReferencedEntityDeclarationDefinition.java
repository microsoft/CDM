// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttributeSetBuilder;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedTraitSetBuilder;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.TimeUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.VisitCallback;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;
import java.util.ArrayList;

public class CdmReferencedEntityDeclarationDefinition extends CdmObjectDefinitionBase implements
    CdmEntityDeclarationDefinition {

  private static final String TAG = CdmReferencedEntityDeclarationDefinition.class.getSimpleName();

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
  public boolean isDerivedFrom(final String baseDef, ResolveOptions resOpt) {
    return false;
  }

  @Override
  public boolean visit(final String pathRoot, final VisitCallback preChildren, final VisitCallback postChildren) {
    String path = "";

    if (preChildren != null && preChildren.invoke(this, path)) {
      return false;
    }

    if (postChildren!= null && postChildren.invoke(this, path)) {
      return true;
    }
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
    ArrayList<String> missingFields = new ArrayList<String>();
    if (StringUtils.isNullOrTrimEmpty(this.getEntityName())) {
      missingFields.add("entityName");
    }
    if (StringUtils.isNullOrTrimEmpty(this.getEntityPath())) {
      missingFields.add("entityPath");
    }

    if (missingFields.size() > 0) {
      Logger.error(this.getCtx(), TAG, "validate", this.getAtCorpusPath(), CdmLogCode.ErrValdnIntegrityCheckFailure, this.getAtCorpusPath(), String.join(", ", missingFields.parallelStream().map((s) -> { return String.format("'%s'", s);}).collect(Collectors.toList())));
      return false;
    }
    return true;
  }

  /**
   *
   * @param resOpt Resolve options
   * @param options Copy options
   * @return Object
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
      resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
    }

    CdmReferencedEntityDeclarationDefinition copy;
    if (host == null) {
      copy = new CdmReferencedEntityDeclarationDefinition(this.getCtx(), this.getEntityName());
    } else {
      copy = (CdmReferencedEntityDeclarationDefinition) host;
      copy.setEntityName(this.getEntityName());
    }

    copy.setEntityPath(this.getEntityPath());
    copy.setLastFileStatusCheckTime(this.getLastFileStatusCheckTime());
    copy.setLastFileModifiedTime(this.getLastFileModifiedTime());

    return copy;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   * @param resOpt Resolved options
   * @return ResolvedAttributeSetBuilder
   */
  @Override
  @Deprecated
  public ResolvedAttributeSetBuilder constructResolvedAttributes(final ResolveOptions resOpt) {
    return constructResolvedAttributes(resOpt, null);
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   * @param resOpt Resolved options
   * @param under context
   * @return ResolvedAttributeSetBuilder
   */
  @Override
  @Deprecated
  public ResolvedAttributeSetBuilder constructResolvedAttributes(final ResolveOptions resOpt,
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
