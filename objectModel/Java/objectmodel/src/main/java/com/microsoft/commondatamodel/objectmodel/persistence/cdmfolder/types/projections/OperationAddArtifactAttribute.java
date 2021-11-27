// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.projections;

import com.fasterxml.jackson.databind.JsonNode;

/**
 * OperationAddArtifactAttribute class
 */
public class OperationAddArtifactAttribute extends OperationBase {
    private JsonNode newAttribute;
    private Boolean insertAtTop;

    public JsonNode getNewAttribute() {
        return newAttribute;
    }

    public void setNewAttribute(final JsonNode newAttribute) {
        this.newAttribute = newAttribute;
    }

    public Boolean getInsertAtTop() {
        return insertAtTop;
    }

    public void setInsertAtTop(final Boolean insertAtTop) {
        this.insertAtTop = insertAtTop;
    }
}
