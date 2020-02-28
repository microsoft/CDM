// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types;

import com.fasterxml.jackson.databind.JsonNode;

public class Parameter {
    private String explanation;
    private String name;
    private JsonNode defaultValue;
    private Boolean required;
    private String direction;
    private JsonNode dataType;

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(final String explanation) {
        this.explanation = explanation;
    }

    public String getName() {
        return name;
    }

    public void setName(final String name) {
        this.name = name;
    }

    public JsonNode getDefaultValue() {
        return defaultValue;
    }

    public void setDefaultValue(final JsonNode defaultValue) {
        this.defaultValue = defaultValue;
    }

    public Boolean getRequired() {
        return required;
    }

    public void setRequired(final Boolean required) {
        this.required = required;
    }

    public String getDirection() {
        return direction;
    }

    public void setDirection(final String direction) {
        this.direction = direction;
    }

    public JsonNode getDataType() {
        return dataType;
    }

    public void setDataType(final JsonNode dataType) {
        this.dataType = dataType;
    }
}

