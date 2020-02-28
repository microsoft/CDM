// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types;

import com.fasterxml.jackson.databind.JsonNode;
import java.util.List;

public class ConstantEntity {
    private String explanation;
    private String constantEntityName;
    private JsonNode entityShape;
    private List<List<String>> constantValues;

    public String getExplanation() {
        return this.explanation;
    }

    public void setExplanation(final String explanation) {
        this.explanation = explanation;
    }

    public String getConstantEntityName() {
        return this.constantEntityName;
    }

    public void setConstantEntityName(final String constantEntityName) {
        this.constantEntityName = constantEntityName;
    }

    public JsonNode getEntityShape() {
        return this.entityShape;
    }

    public void setEntityShape(final JsonNode entityShape) {
        this.entityShape = entityShape;
    }

    public List<List<String>> getConstantValues() {
        return this.constantValues;
    }

    public void setConstantValues(final List<List<String>> constantValues) {
        this.constantValues = constantValues;
    }
}
