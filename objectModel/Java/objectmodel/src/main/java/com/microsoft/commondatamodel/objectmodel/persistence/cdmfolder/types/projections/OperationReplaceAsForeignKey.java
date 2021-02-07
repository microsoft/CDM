// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.projections;

import com.fasterxml.jackson.databind.JsonNode;

/**
 * OperationReplaceAsForeignKey class
 */
public class OperationReplaceAsForeignKey extends OperationBase {
    private String reference;
    private JsonNode replaceWith;

    public String getReference() {
        return reference;
    }

    public void setReference(final String reference) {
        this.reference = reference;
    }

    public JsonNode getReplaceWith() {
        return replaceWith;
    }

    public void setReplaceWith(final JsonNode replaceWith) {
        this.replaceWith = replaceWith;
    }
}
