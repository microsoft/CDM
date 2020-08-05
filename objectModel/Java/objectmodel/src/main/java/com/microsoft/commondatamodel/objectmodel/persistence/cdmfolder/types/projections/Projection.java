// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.projections;

import java.util.List;

/**
 * Projection class
 */
public class Projection {
    private String explanation;
    private String condition;
    private List<OperationBase> operations;
    private Object source;

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(final String explanation) {
        this.explanation = explanation;
    }

    public String getCondition() {
        return condition;
    }

    public void setCondition(final String condition) {
        this.condition = condition;
    }

    public List<OperationBase> getOperations() {
        return operations;
    }

    public void setOperations(final List<OperationBase> operations) {
        this.operations = operations;
    }

    public Object getSource() {
        return source;
    }

    public void setSource(final Object source) {
        this.source = source;
    }
}
