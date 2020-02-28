// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

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
  public <T extends CdmObjectDefinition> T fetchObjectDefinition(ResolveOptions resOpt) {
    if (resOpt == null) {
      resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
    }

    return null;
  }

  @Override
  public CdmObjectReference createSimpleReference(ResolveOptions resOpt) {
    if (resOpt == null) {
      resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
    }

    return null;
  }

  @Override
  public boolean isDerivedFrom(final String baseDef, ResolveOptions resOpt) {
    if (resOpt == null) {
      resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
    }
    
    return false;
  }
}
