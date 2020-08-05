// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.projections;

/**
 * OperationRenameAttributes class
 */
public class OperationRenameAttributes extends OperationBase {
    private String renameFormat;
    private Object applyTo;

    public String getRenameFormat() {
        return renameFormat;
    }

    public void setRenameFormat(final String renameFormat) {
        this.renameFormat = renameFormat;
    }

    public Object getApplyTo() {
        return applyTo;
    }

    public void setApplyTo(final Object applyTo) {
        this.applyTo = applyTo;
    }
}
