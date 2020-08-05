// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.projections;

/**
 * OperationArrayExpansion class
 */
public class OperationArrayExpansion extends OperationBase {
    private Integer startOrdinal;
    private Integer endOrdinal;

    public Integer getStartOrdinal() {
        return startOrdinal;
    }

    public void setStartOrdinal(final Integer startOrdinal) {
        this.startOrdinal = startOrdinal;
    }

    public Integer getEndOrdinal() {
        return endOrdinal;
    }

    public void setEndOrdinal(final Integer endOrdinal) {
        this.endOrdinal = endOrdinal;
    }
}
