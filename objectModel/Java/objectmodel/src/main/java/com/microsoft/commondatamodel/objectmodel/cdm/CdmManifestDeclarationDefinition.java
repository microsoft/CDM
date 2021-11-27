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
import java.util.ArrayList;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

public class CdmManifestDeclarationDefinition extends CdmObjectDefinitionBase implements CdmFileStatus {

  private static final String TAG = CdmManifestDeclarationDefinition.class.getSimpleName();

  private String manifestName;
  private OffsetDateTime lastFileStatusCheckTime;
  private OffsetDateTime lastFileModifiedTime;
  private OffsetDateTime lastChildModifiedTime;
  private String definition;

  public CdmManifestDeclarationDefinition(final CdmCorpusContext ctx, final String name) {
    super(ctx);
    this.setObjectType(CdmObjectType.ManifestDeclarationDef);
    this.manifestName = name;
  }

  public String getDefinition() {
    return this.definition;
  }

  public void setDefinition(final String value) {
    this.definition = value;
  }

  public String getManifestName() {
    return this.manifestName;
  }

  public void setManifestName(final String value) {
    this.manifestName = value;
  }

  @Override
  public OffsetDateTime getLastFileStatusCheckTime() {
    return this.lastFileStatusCheckTime;
  }

  @Override
  public void setLastFileStatusCheckTime(final OffsetDateTime value) {
    this.lastFileStatusCheckTime = value;
  }

  @Override
  public OffsetDateTime getLastFileModifiedTime() {
    return this.lastFileModifiedTime;
  }

  @Override
  public void setLastFileModifiedTime(final OffsetDateTime value) {
    this.lastFileModifiedTime = value;
  }

  @Override
  public OffsetDateTime getLastChildFileModifiedTime() {
    return lastChildModifiedTime;
  }

  @Override
  public void setLastChildFileModifiedTime(final OffsetDateTime time) {
    this.lastChildModifiedTime = time;
  }

  @Override
  public CompletableFuture<Void> fileStatusCheckAsync() {

    final String fullPath =
        this.getCtx()
            .getCorpus()
            .getStorage()
            .createAbsoluteCorpusPath(this.getDefinition(), this.getInDocument());
    return getCtx().getCorpus().computeLastModifiedTimeAsync(fullPath, this)
      .thenCompose((modifiedTime) -> {
        // update modified times
        setLastFileStatusCheckTime(OffsetDateTime.now(ZoneOffset.UTC));
        setLastFileModifiedTime(TimeUtils.maxTime(modifiedTime, getLastFileModifiedTime()));

        return reportMostRecentTimeAsync(getLastFileModifiedTime());
      });
  }

  @Override
  public CompletableFuture<Void> reportMostRecentTimeAsync(final OffsetDateTime childTime) {
    if (this.getOwner() instanceof CdmFileStatus && childTime != null) {
      return ((CdmFileStatus) this.getOwner()).reportMostRecentTimeAsync(childTime);
    }
    return CompletableFuture.completedFuture(null);
  }

  @Override
  public String getName() {
    return this.manifestName;
  }

  @Override
  public boolean isDerivedFrom(final String baseDef, ResolveOptions resOpt) {
    return false;
  }

  @Override
  public boolean visit(
      final String pathFrom,
      final VisitCallback preChildren,
      final VisitCallback postChildren) {
    String path = this.fetchDeclaredPath(pathFrom);

    if (preChildren != null && preChildren.invoke(this, path)) {
      return false;
    }

    if (this.visitDef(path, preChildren, postChildren)) {
      return true;
    }

    if (postChildren != null && postChildren.invoke(this, path)) {
      return true;
    }

    return false;
  }

  @Override
  public boolean validate() {
    ArrayList<String> missingFields = new ArrayList<String>();
    if (StringUtils.isNullOrTrimEmpty(this.getManifestName())) {
      missingFields.add("manifestName");
    }
    if (StringUtils.isNullOrTrimEmpty(this.getDefinition())) {
      missingFields.add("definition");
    }

    if (missingFields.size() > 0) {
      Logger.error(this.getCtx(), TAG, "validate", this.getAtCorpusPath(), CdmLogCode.ErrValdnIntegrityCheckFailure, this.getAtCorpusPath(), String.join(", ", missingFields.parallelStream().map((s) -> { return String.format("'%s'", s);}).collect(Collectors.toList())));
      return false;
    }
    return true;
  }

  @Override
  public Object copyData(final ResolveOptions resOpt, final CopyOptions options) {
    return CdmObjectBase.copyData(this, resOpt, options, CdmManifestDeclarationDefinition.class);
  }

  /**
   *
   * @param resOpt Resolved options
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

    CdmManifestDeclarationDefinition copy;
    if (host == null) {
      copy = new CdmManifestDeclarationDefinition(this.getCtx(), this.getManifestName());
    } else {
      copy = (CdmManifestDeclarationDefinition) host;
      copy.setManifestName(this.getManifestName());
    }

    copy.setDefinition(this.getDefinition());
    copy.setLastFileStatusCheckTime(this.getLastFileStatusCheckTime());
    copy.setLastFileModifiedTime(this.getLastFileModifiedTime());

    this.copyDef(resOpt, copy);

    return copy;
  }


  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public ResolvedAttributeSetBuilder constructResolvedAttributes(final ResolveOptions resOpt) {
    return constructResolvedAttributes(resOpt, null);
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public ResolvedAttributeSetBuilder constructResolvedAttributes(final ResolveOptions resOpt,
                                                          final CdmAttributeContext under) {
    // return null intentionally
    return null;
  }

  @Override
  void constructResolvedTraits(final ResolvedTraitSetBuilder rtsb, final ResolveOptions resOpt) {
//    INTENTIONALLY LEFT BLANK
  }
}
