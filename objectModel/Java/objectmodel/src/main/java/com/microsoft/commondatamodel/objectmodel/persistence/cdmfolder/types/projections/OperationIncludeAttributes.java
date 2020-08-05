// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.projections;

import java.util.List;

/**
 * OperationIncludeAttributes class
 */
public class OperationIncludeAttributes extends OperationBase {
    private List<String> includeAttributes;

    public List<String> getIncludeAttributes() {
        return includeAttributes;
    }

    public void setIncludeAttributes(final List<String> includeAttributes) {
        this.includeAttributes = includeAttributes;
    }
}
