package com.microsoft.commondatamodel.objectmodel.cdm;

import com.google.common.base.Strings;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.VisitCallback;

public class CdmE2ERelationship extends CdmObjectDefinitionBase {

  private String name;
  private String fromEntity;
  private String fromEntityAttribute;
  private String toEntity;
  private String toEntityAttribute;

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
  }

  @Override
  public boolean visit(final String pathRoot, final VisitCallback preChildren, final VisitCallback postChildren) {
    if (Strings.isNullOrEmpty(this.getDeclaredPath())) {
      this.setDeclaredPath(pathRoot + this.getName());
    }

    final String path = this.getDeclaredPath();

    if (preChildren != null && preChildren.invoke(this, path)) {
      return false;
    }

    if (this.visitDef(path, preChildren, postChildren)) {
      return true;
    }

    return postChildren != null && postChildren.invoke(this, path);
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

  @Override
  public boolean isDerivedFrom(final ResolveOptions resOpt, final String baseDef) {
    return false;
  }

  @Override
  public boolean validate() {
    return !Strings.isNullOrEmpty(this.fromEntity)
        && !Strings.isNullOrEmpty(this.fromEntityAttribute)
        && !Strings.isNullOrEmpty(this.toEntity)
        && !Strings.isNullOrEmpty(this.toEntityAttribute);
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
    return CdmObjectBase.copyData(this, resOpt, options, CdmE2ERelationship.class);
  }

  @Override
  public CdmObject copy(final ResolveOptions resOpt) {
    final CdmE2ERelationship copy = new CdmE2ERelationship(this.getCtx(), this.getName());

    copy.setFromEntity(this.getFromEntity());
    copy.setFromEntityAttribute(this.getFromEntityAttribute());
    copy.setToEntity(this.getToEntity());
    copy.setToEntityAttribute(this.getToEntityAttribute());

    this.copyDef(resOpt, copy);

    return copy;
  }
}
