// Copyright (c) Microsoft Corporation.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedEntityReferenceSet;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;

public interface CdmReferencesEntities {
  ResolvedEntityReferenceSet fetchResolvedEntityReferences(ResolveOptions resOpt);
}
