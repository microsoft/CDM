package com.microsoft.commondatamodel.objectmodel.utilities;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeResolutionGuidance;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttribute;

public class ApplierContext {
  public String state;
  public ResolveOptions resOpt;
  public CdmAttributeContext attCtx;
  public CdmAttributeResolutionGuidance resGuide;
  public ResolvedAttribute resAttSource;
  public ResolvedAttribute resAttNew;
  public CdmAttributeResolutionGuidance resGuideNew;
  public Boolean continues;
}
