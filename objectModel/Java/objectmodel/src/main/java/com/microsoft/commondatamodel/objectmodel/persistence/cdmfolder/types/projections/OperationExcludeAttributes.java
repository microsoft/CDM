// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.projections;

import java.util.List;

/**
 * OperationExcludeAttributes class
 */
public class OperationExcludeAttributes extends OperationBase {
    private List<String> excludeAttributes;

    public List<String> getExcludeAttributes() {
        return excludeAttributes;
    }

    public void setExcludeAttributes(final List<String> excludeAttributes) {
        this.excludeAttributes = excludeAttributes;
    }
}
