package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;

public abstract class CdmObjectSimple extends CdmObjectBase {
  public CdmObjectSimple() {
  }

  public CdmObjectSimple(final CdmCorpusContext ctx) {
    super(ctx);
  }

  @Override
  public String fetchObjectDefinitionName() {
    return null;
  }

  @Override
  public <T extends CdmObjectDefinition> T fetchObjectDefinition(final ResolveOptions resOpt) {
    return null;
  }

  @Override
  public CdmObjectReference createSimpleReference(final ResolveOptions resOpt) {
    return null;
  }

  @Override
  public boolean isDerivedFrom(final String baseDef, final ResolveOptions resOpt) {
    return false;
  }
}
