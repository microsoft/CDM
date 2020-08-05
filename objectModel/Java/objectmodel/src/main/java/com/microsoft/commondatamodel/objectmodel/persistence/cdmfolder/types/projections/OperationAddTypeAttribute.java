// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.projections;

import com.fasterxml.jackson.databind.JsonNode;

/**
 * OperationAddTypeAttribute class
 */
public class OperationAddTypeAttribute extends OperationBase {
    private JsonNode typeAttribute;

    public JsonNode getTypeAttribute() {
        return typeAttribute;
    }

    public void setTypeAttribute(final JsonNode typeAttribute) {
        this.typeAttribute = typeAttribute;
    }
}
