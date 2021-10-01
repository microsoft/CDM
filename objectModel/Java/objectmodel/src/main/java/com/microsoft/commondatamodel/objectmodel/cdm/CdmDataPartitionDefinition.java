// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmPropertyName;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.TimeUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.TraitToPropertyMap;
import com.microsoft.commondatamodel.objectmodel.utilities.VisitCallback;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.*;
import java.util.concurrent.CompletableFuture;

public class CdmDataPartitionDefinition extends CdmObjectDefinitionBase implements CdmFileStatus {

  private Map<String, List<String>> arguments;
  private String specializedSchema;
  private OffsetDateTime lastFileStatusCheckTime;
  private OffsetDateTime lastFileModifiedTime;
  private OffsetDateTime lastChildModifiedTime;
  private String name;
  private OffsetDateTime refreshTime;
  private TraitToPropertyMap t2pm;
  private String location;
  private boolean inferred;
  
  public CdmDataPartitionDefinition(final CdmCorpusContext ctx, final String name) {
    super(ctx);
    this.setName(name);
    this.setObjectType(CdmObjectType.DataPartitionDef);
    this.setArguments(new LinkedHashMap<>());
    this.setInferred(false);
  }

  @Override
  public boolean validate() {
    return true;
  }

  /**
   *
   * @param resOpt Resolved options
   * @param options copy options
   * @return Object
   * @deprecated CopyData is deprecated. Please use the Persistence Layer instead. This function is
   * extremely likely to be removed in the public interface, and not meant to be called externally
   * at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public Object copyData(final ResolveOptions resOpt, final CopyOptions options) {
    return CdmObjectBase.copyData(this, resOpt, options, CdmDataPartitionDefinition.class);
  }

  @Override
  public CdmObject copy(ResolveOptions resOpt, CdmObject host) {
    CdmDataPartitionDefinition copy;
    if (resOpt == null) {
      resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
    }

    if (host == null) {
      copy = new CdmDataPartitionDefinition(getCtx(), getName());
    } else {
      copy = (CdmDataPartitionDefinition) host;
      copy.setName(this.getName());
    }

    copy.setDescription(getDescription());
    copy.setLocation(getLocation());
    copy.setLastFileStatusCheckTime(getLastFileStatusCheckTime());
    copy.setLastFileModifiedTime(getLastFileModifiedTime());
    copy.setInferred(isInferred());
    if (this.getArguments() != null)
    {
      // deep copy the content
      copy.setArguments(new HashMap<>());
      for (final String key : this.getArguments().keySet()) {
        copy.getArguments().put(key, new ArrayList<>(this.getArguments().get(key)));
      }
    }
    copy.setSpecializedSchema(getSpecializedSchema());

    copyDef(resOpt, copy);

    return copy;
  }

  private TraitToPropertyMap getTraitToPropertyMap() {
    if (this.t2pm == null) {
      this.t2pm = new TraitToPropertyMap(this);
    }

    return this.t2pm;
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

  @Deprecated
  public String fetchDeclaredPath(String pathFrom) {
    return pathFrom + (this.getName() == null ? "UNNAMED": this.getName());
  }

  /**
   * Gets or sets the name of a data partition.
   * @return String
   */
  @Override
  public String getName() {
    return this.name;
  }

  public void setName(final String value) {
    this.name = value;
  }

  /**
   * Gets or sets the corpus path for the data file location.
   * @return String
   */
  public String getLocation() {
    return this.location;
  }

  public void setLocation(final String value) {
    this.location = value;
  }

  public boolean isInferred() {
    return this.inferred;
  }

  public void setInferred(final boolean value) {
    this.inferred = value;
  }

  /**
   * Gets or sets the list of key value pairs to give names for the replacement values from the
   * RegEx.
   * @return map of String to list of strings
   */
  public Map<String, List<String>> getArguments() {
    return this.arguments;
  }

  public void setArguments(final Map<String, List<String>> value) {
    this.arguments = value;
  }

  /**
   * Gets or sets the path of a specialized schema to use specifically for the partitions
   * generated.
   * @return String
   */
  public String getSpecializedSchema() {
    return this.specializedSchema;
  }

  public void setSpecializedSchema(final String value) {
    this.specializedSchema = value;
  }

  /**
   * Gets or sets the name of a data partition.
   * @return String
   */
  public String getDescription() {
    return (String) getTraitToPropertyMap().fetchPropertyValue(CdmPropertyName.DESCRIPTION);
  }

  public void setDescription(final String value) {
    getTraitToPropertyMap().updatePropertyValue(CdmPropertyName.DESCRIPTION, value);
  }

  /**
   * Gets or sets the name of a data partition.
   * @return Offset date time
   */
  public OffsetDateTime getRefreshTime() {
    return this.refreshTime;
  }

  public void setRefreshTime(final OffsetDateTime value) {
    this.refreshTime = value;
  }

  /**
   * Last time the modified times were updated.
   * @return Offset date time
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
   * LastChildFileModifiedTime is not valid for DataPartitions since they do not contain any children objects.
   * @return Offset date time
   */
  @Override
  public OffsetDateTime getLastChildFileModifiedTime() {
    throw new UnsupportedOperationException();
  }

  /**
   * LastChildFileModifiedTime is not valid for DataPartitions since they do not contain any children objects.
   * @param time offset time
   */
  @Override
  public void setLastChildFileModifiedTime(final OffsetDateTime time) {
    throw new UnsupportedOperationException();
  }

  /**
   * Last time this file was modified according to the OM.
   * @return Offset date time
   */
  @Override
  public OffsetDateTime getLastFileModifiedTime() {
    return this.lastFileModifiedTime;
  }

  @Override
  public void setLastFileModifiedTime(final OffsetDateTime value) {
    this.lastFileModifiedTime = value;
  }

  /**
   * Updates the object and any children with changes made in the document file where it came from.
   * @return CompletableFuture
   */
  @Override
  public CompletableFuture<Void> fileStatusCheckAsync() {
    try (Logger.LoggerScope logScope = Logger.enterScope(CdmDataPartitionDefinition.class.getSimpleName(), getCtx(), "fileStatusCheckAsync")) {
      final String fullPath =
              this.getCtx()
                      .getCorpus()
                      .getStorage()
                      .createAbsoluteCorpusPath(this.getLocation(), this.getInDocument());

      final OffsetDateTime modifiedTime =
              this.getCtx().getCorpus().getLastModifiedTimeFromPartitionPathAsync(fullPath).join();

      // update modified times
      setLastFileStatusCheckTime(OffsetDateTime.now(ZoneOffset.UTC));
      setLastFileModifiedTime(TimeUtils.maxTime(modifiedTime, getLastFileModifiedTime()));

      return reportMostRecentTimeAsync(getLastFileModifiedTime());
    }
  }

  /**
   * Report most recent modified time (of current or children objects) to the parent object.
   * @param childTime datetime offset
   * @return CompletableFuture
   */
  @Override
  public CompletableFuture<Void> reportMostRecentTimeAsync(final OffsetDateTime childTime) {
    if (getOwner() instanceof CdmFileStatus && childTime != null) {
      return ((CdmFileStatus) getOwner()).reportMostRecentTimeAsync(childTime);
    }

    return CompletableFuture.completedFuture(null);
  }
}
