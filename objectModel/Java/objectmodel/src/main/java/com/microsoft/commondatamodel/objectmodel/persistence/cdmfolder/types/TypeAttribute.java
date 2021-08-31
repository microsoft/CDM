// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;

public class TypeAttribute {
    private String explanation;
    private String name;
    private JsonNode purpose;
    private JsonNode dataType;
    private ArrayNode appliedTraits;
    private JsonNode attributeContext;
    private Boolean isPrimaryKey;
    private Boolean isReadOnly;
    private Boolean isNullable;
    private String dataFormat;
    private String sourceName;
    private Integer sourceOrdering;
    private String displayName;
    private String description;
    private String maximumValue;
    private String minimumValue;
    private Integer maximumLength;
    private Boolean valueConstrainedToList;
    private JsonNode defaultValue;
    private JsonNode resolutionGuidance;
    private JsonNode cardinalitySettings;
    private JsonNode projection;

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

    public JsonNode getPurpose() {
        return purpose;
    }

    public void setPurpose(final JsonNode purpose) {
        this.purpose = purpose;
    }

    public JsonNode getDataType() {
        return dataType;
    }

    public void setDataType(final JsonNode dataType) {
        this.dataType = dataType;
    }

    public ArrayNode getAppliedTraits() {
        return appliedTraits;
    }

    public void setAppliedTraits(final ArrayNode appliedTraits) {
        this.appliedTraits = appliedTraits;
    }

    public JsonNode getAttributeContext() {
        return attributeContext;
    }

    public void setAttributeContext(final JsonNode attributeContext) {
        this.attributeContext = attributeContext;
    }

    public Boolean getIsPrimaryKey() {
        return isPrimaryKey;
    }

    public void setIsPrimaryKey(final Boolean isPrimaryKey) {
        this.isPrimaryKey = isPrimaryKey;
    }

    public Boolean getIsReadOnly() {
        return isReadOnly;
    }

    public void setIsReadOnly(final Boolean isReadOnly) {
        this.isReadOnly = isReadOnly;
    }

    public Boolean getIsNullable() {
        return isNullable;
    }

    public void setIsNullable(final Boolean isNullable) {
        this.isNullable = isNullable;
    }

    public String getDataFormat() {
        return dataFormat;
    }

    public void setDataFormat(final String dataFormat) {
        this.dataFormat = dataFormat;
    }

    public String getSourceName() {
        return sourceName;
    }

    public void setSourceName(final String sourceName) {
        this.sourceName = sourceName;
    }

    public Integer getSourceOrdering() {
        return sourceOrdering;
    }

    public void setSourceOrdering(final Integer sourceOrdering) {
        this.sourceOrdering = sourceOrdering;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(final String displayName) {
        this.displayName = displayName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(final String description) {
        this.description = description;
    }

    public String getMaximumValue() {
        return maximumValue;
    }

    public void setMaximumValue(final String maximumValue) {
        this.maximumValue = maximumValue;
    }

    public String getMinimumValue() {
        return minimumValue;
    }

    public void setMinimumValue(final String minimumValue) {
        this.minimumValue = minimumValue;
    }

    public Integer getMaximumLength() {
        return maximumLength;
    }

    public void setMaximumLength(final Integer maximumLength) {
        this.maximumLength = maximumLength;
    }

    public Boolean getValueConstrainedToList() {
        return valueConstrainedToList;
    }

    public void setValueConstrainedToList(final Boolean valueConstrainedToList) {
        this.valueConstrainedToList = valueConstrainedToList;
    }

    public JsonNode getDefaultValue() {
        return defaultValue;
    }

    public void setDefaultValue(final JsonNode defaultValue) {
        this.defaultValue = defaultValue;
    }

    public JsonNode getResolutionGuidance() {
        return resolutionGuidance;
    }

    public void setResolutionGuidance(final JsonNode resolutionGuidance) {
        this.resolutionGuidance = resolutionGuidance;
    }

    public JsonNode getCardinalitySettings() { return cardinalitySettings; }

    public void setCardinalitySettings(final JsonNode cardinalitySettings) {
        this.cardinalitySettings = cardinalitySettings;
    }

    public JsonNode getProjection() {
        return projection;
    }

    public void setProjection(final JsonNode projection) {
        this.projection = projection;
    }
}
