// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedEntityReferenceSet;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;

public interface CdmReferencesEntities {
  ResolvedEntityReferenceSet fetchResolvedEntityReferences(ResolveOptions resOpt);
}
