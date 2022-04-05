// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.stream.Collectors;

import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.VisitCallback;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

public class CdmE2ERelationship extends CdmObjectDefinitionBase {

  private static final String TAG = CdmE2ERelationship.class.getSimpleName();
  
  private String name;
  private String fromEntity;
  private String fromEntityAttribute;
  private String toEntity;
  private String toEntityAttribute;
  private OffsetDateTime lastFileModifiedTime;
  private OffsetDateTime lastFileModifiedOldTime;
  private HashMap<CdmTraitReference, String> elevatedTraitCorpusPath;

  public CdmE2ERelationship(
      final CdmCorpusContext ctx,
      final String name) {
    super(ctx);
    this.name = name;
    this.fromEntity = null;
    this.fromEntityAttribute = null;
    this.toEntity = null;
    this.toEntityAttribute = null;
    this.setObjectType(CdmObjectType.E2ERelationshipDef);
    this.lastFileModifiedTime = null;
    this.lastFileModifiedOldTime = null;
    this.elevatedTraitCorpusPath = new HashMap<>();
  }

  @Override
  public boolean visit(final String pathFrom, final VisitCallback preChildren, final VisitCallback postChildren) {
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
  public String getName() {
    return this.name;
  }

  public void setName(final String value) {
    this.name = value;
  }

  public String getFromEntity() {
    return this.fromEntity;
  }

  public void setFromEntity(final String value) {
    this.fromEntity = value;
  }

  public String getFromEntityAttribute() {
    return this.fromEntityAttribute;
  }

  public void setFromEntityAttribute(final String value) {
    this.fromEntityAttribute = value;
  }

  public String getToEntity() {
    return this.toEntity;
  }

  public void setToEntity(final String value) {
    this.toEntity = value;
  }

  public String getToEntityAttribute() {
    return this.toEntityAttribute;
  }

  public void setToEntityAttribute(final String value) {
    this.toEntityAttribute = value;
  }

  public OffsetDateTime getlastFileModifiedOldTime() {
    return this.lastFileModifiedOldTime;
  }

  private void setlastFileModifiedOldTime(OffsetDateTime lastFileModifiedOldTime) {
    this.lastFileModifiedOldTime = lastFileModifiedOldTime;
  }

  public OffsetDateTime getlastFileModifiedTime() {
    return this.lastFileModifiedTime;
  }

  public void setlastFileModifiedTime(OffsetDateTime lastFileModifiedTime) {
    this.setlastFileModifiedOldTime(lastFileModifiedTime);
    this.lastFileModifiedTime = lastFileModifiedTime;
  }

  @Deprecated
  public HashMap<CdmTraitReference, String> getElevatedTraitCorpusPath() {
    return this.elevatedTraitCorpusPath;
  }

  @Override
  public boolean isDerivedFrom(final String baseDef, ResolveOptions resOpt) {
    return false;
  }

  @Override
  public boolean validate() {
    ArrayList<String> missingFields = new ArrayList<String>();
    if (StringUtils.isNullOrTrimEmpty(this.fromEntity)) {
      missingFields.add("fromEntity");
    }
    if (StringUtils.isNullOrTrimEmpty(this.fromEntityAttribute)) {
      missingFields.add("fromEntityAttribute");
    }
    if (StringUtils.isNullOrTrimEmpty(this.toEntity)) {
      missingFields.add("toEntity");
    }
    if (StringUtils.isNullOrTrimEmpty(this.toEntityAttribute)) {
      missingFields.add("toEntityAttribute");
    }

    if (missingFields.size() > 0) {
      Logger.error(this.getCtx(), TAG, "validate", this.getAtCorpusPath(), CdmLogCode.ErrValdnIntegrityCheckFailure, this.getAtCorpusPath(), String.join(", ", missingFields.parallelStream().map((s) -> { return String.format("'%s'", s);}).collect(Collectors.toList())));
      return false;
    }
    return true;
  }

  /**
   *
   * @param resOpt Resolved options
   * @param options Copy options
   * @return Object
   * @deprecated CopyData is deprecated. Please use the Persistence Layer instead. This function is
   * extremely likely to be removed in the public interface, and not meant to be called externally
   * at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public Object copyData(final ResolveOptions resOpt, final CopyOptions options) {
    return CdmObjectBase.copyData(this, resOpt, options, CdmE2ERelationship.class);
  }

  @Override
  public CdmObject copy(ResolveOptions resOpt, CdmObject host) {
    if (resOpt == null) {
      resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
    }

    CdmE2ERelationship copy;
    if (host == null) {
      copy = new CdmE2ERelationship(this.getCtx(), this.getName());
    } else {
      copy = (CdmE2ERelationship) host;
      copy.setName(this.getName());
    }

    copy.setFromEntity(this.getFromEntity());
    copy.setFromEntityAttribute(this.getFromEntityAttribute());
    copy.setToEntity(this.getToEntity());
    copy.setToEntityAttribute(this.getToEntityAttribute());

    this.copyDef(resOpt, copy);

    return copy;
  }

  /**
   * Reset LastFileModifiedOldTime.
   */
  public void resetLastFileModifiedOldTime()
  {
      this.setlastFileModifiedOldTime(null);
  }

  /**
   * standardized way of turning a relationship object into a key for caching
   * without using the object itself as a key (could be duplicate relationship objects)
   * @return String
   */
  public String createCacheKey() {
    String nameAndPipe = "";
    if (!StringUtils.isNullOrTrimEmpty(this.getName())) {
      nameAndPipe = this.getName() + "|";
    }
    return nameAndPipe + this.getToEntity() + "|" + this.getToEntityAttribute() + "|" + this.getFromEntity() + "|" + this.getFromEntityAttribute();
  }
}
