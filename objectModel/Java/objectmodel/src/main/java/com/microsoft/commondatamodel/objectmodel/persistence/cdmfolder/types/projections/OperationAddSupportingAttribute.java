// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.projections;

import com.fasterxml.jackson.databind.JsonNode;

/**
 * OperationAddSupportingAttribute class
 */
public class OperationAddSupportingAttribute extends OperationBase {
    private JsonNode supportingAttribute;

    public JsonNode getSupportingAttribute() {
        return supportingAttribute;
    }

    public void setSupportingAttribute(final JsonNode supportingAttribute) {
        this.supportingAttribute = supportingAttribute;
    }
}
