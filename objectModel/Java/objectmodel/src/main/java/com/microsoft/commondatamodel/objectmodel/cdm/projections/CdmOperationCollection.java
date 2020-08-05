// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.projections;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmCollection;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObject;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;

/**
 * Collection of operations
 */
public class CdmOperationCollection extends CdmCollection<CdmOperationBase> {
    public CdmOperationCollection(final CdmCorpusContext ctx, final CdmObject owner) {
        super(ctx, owner, CdmObjectType.Error);
    }

    public CdmOperationBase add(CdmOperationBase operation) {
        return super.add(operation);
    }

    public boolean remove(CdmOperationBase operation) {
        return super.remove(operation);
    }
}
