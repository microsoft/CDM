package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;

public class EntityAttribute {
    private String explanation;
    private JsonNode purpose;
    private JsonNode entity;
    private String name;
    private ArrayNode appliedTraits;
    private JsonNode resolutionGuidance;

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
}

