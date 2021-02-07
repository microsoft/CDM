// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types;

import com.fasterxml.jackson.databind.JsonNode;

public class Expansion {
    private Integer startingOrdinal;
    private Integer maximumExpansion;
    private JsonNode countAttribute;

    public Integer getStartingOrdinal() {
        return this.startingOrdinal;
    }

    public void setStartingOrdinal(final Integer startingOrdinal) {
        this.startingOrdinal = startingOrdinal;
    }

    public Integer getMaximumExpansion() {
        return this.maximumExpansion;
    }

    public void setMaximumExpansion(final Integer maximumExpansion) {
        this.maximumExpansion = maximumExpansion;
    }

    public JsonNode getCountAttribute() {
        return this.countAttribute;
    }

    public void setCountAttribute(final JsonNode countAttribute) {
        this.countAttribute = countAttribute;
    }
}
