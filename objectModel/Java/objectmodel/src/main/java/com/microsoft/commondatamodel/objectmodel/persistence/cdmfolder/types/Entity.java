package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import java.util.List;

public class Entity {
    private String explanation;
    private String entityName;
    private JsonNode extendsEntity;
    private JsonNode extendsEntityResolutionGuidance;
    private ArrayNode exhibitsTraits;
    private JsonNode attributeContext;
    @JsonProperty("hasAttributes")
    private ArrayNode attributes;
    private String sourceName;
    private String displayName;
    private String description;
    private String version;
    private List<String> cdmSchemas;

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(final String explanation) {
        this.explanation = explanation;
    }

    public String getEntityName() {
        return entityName;
    }

    public void setEntityName(final String entityName) {
        this.entityName = entityName;
    }

    public JsonNode getExtendsEntity() {
        return extendsEntity;
    }

    public void setExtendsEntity(final JsonNode extendsEntity) {
        this.extendsEntity = extendsEntity;
    }

    public JsonNode getExtendsEntityResolutionGuidance() {
        return extendsEntityResolutionGuidance;
    }

    public void setExtendsEntityResolutionGuidance(JsonNode extendsEntityResolutionGuidance) {
        this.extendsEntityResolutionGuidance = extendsEntityResolutionGuidance;
    }

    public ArrayNode getExhibitsTraits() {
        return exhibitsTraits;
    }

    public void setExhibitsTraits(final ArrayNode exhibitsTraits) {
        this.exhibitsTraits = exhibitsTraits;
    }

    public JsonNode getAttributeContext() {
        return attributeContext;
    }

    public void setAttributeContext(final JsonNode attributeContext) {
        this.attributeContext = attributeContext;
    }

    public ArrayNode getAttributes() {
        return attributes;
    }

    public void setAttributes(final ArrayNode attributes) {
        this.attributes = attributes;
    }

    public String getSourceName() {
        return sourceName;
    }

    public void setSourceName(final String sourceName) {
        this.sourceName = sourceName;
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

    public String getVersion() {
        return version;
    }

    public void setVersion(final String version) {
        this.version = version;
    }

    public List<String> getCdmSchemas() {
        return cdmSchemas;
    }

    public void setCdmSchemas(final List<String> cdmSchemas) {
        this.cdmSchemas = cdmSchemas;
    }
}

