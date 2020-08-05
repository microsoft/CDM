// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.projections;

import com.fasterxml.jackson.databind.JsonNode;

/**
 * OperationAddCountAttribute class
 */
public class OperationAddCountAttribute extends OperationBase {
    private JsonNode countAttribute;

    public JsonNode getCountAttribute() {
        return countAttribute;
    }

    public void setCountAttribute(final JsonNode countAttribute) {
        this.countAttribute = countAttribute;
    }
}
