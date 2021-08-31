// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;

public class EntityAttribute {
    private String explanation;
    private JsonNode purpose;
    private JsonNode entity;
    private String name;
    private String description;
    private String displayName;
    private ArrayNode appliedTraits;
    private JsonNode resolutionGuidance;
    private JsonNode cardinalitySettings;
    private Boolean isPolymorphicSource;

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(final String explanation) {
        this.explanation = explanation;
    }

    public JsonNode getPurpose() {
        return purpose;
    }

    public void setPurpose(final JsonNode purpose) {
        this.purpose = purpose;
    }

    public JsonNode getEntity() {
        return entity;
    }

    public void setEntity(final JsonNode entity) {
        this.entity = entity;
    }

    public String getName() {
        return name;
    }

    public void setName(final String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(final String description) {
        this.description = description;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(final String displayName) {
        this.displayName = displayName;
    }

    public ArrayNode getAppliedTraits() {
        return appliedTraits;
    }

    public void setAppliedTraits(final ArrayNode appliedTraits) {
        this.appliedTraits = appliedTraits;
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

    public Boolean getIsPolymorphicSource() {
        return isPolymorphicSource;
    }

    public void setIsPolymorphicSource(final Boolean polymorphicSource) {
        isPolymorphicSource = polymorphicSource;
    }
}

