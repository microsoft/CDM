package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.node.ArrayNode;
import java.time.OffsetDateTime;
import java.util.List;

/**
 * The folder declaration for CDM folders format.
 */
public class ManifestContent extends DocumentContent {
    private String manifestName;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String explanation;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private ArrayNode exhibitsTraits;

    private ArrayNode entities;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private List<ManifestDeclaration> subManifests;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private OffsetDateTime lastFileStatusCheckTime;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private OffsetDateTime lastFileModifiedTime;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private OffsetDateTime lastChildFileModifiedTime;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String jsonSchemaSemanticVersion;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private List<E2ERelationship> relationships;

    public String getManifestName() {
        return manifestName;
    }

    public void setManifestName(final String manifestName) {
        this.manifestName = manifestName;
    }

    public void setFolioName(final String folioName) {
        this.manifestName = folioName;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(final String explanation) {
        this.explanation = explanation;
    }

    public ArrayNode getExhibitsTraits() {
        return exhibitsTraits;
    }

    public void setExhibitsTraits(final ArrayNode exhibitsTraits) {
        this.exhibitsTraits = exhibitsTraits;
    }

    public ArrayNode getEntities() {
        return entities;
    }

    public void setEntities(final ArrayNode entities) {
        this.entities = entities;
    }

    public List<ManifestDeclaration> getSubManifests() {
        return subManifests;
    }

    public void setSubFolios(final List<ManifestDeclaration> subManifests) {
        // Backward compatibility support for subFolios
        this.subManifests = subManifests;
    }

    public void setSubManifests(final List<ManifestDeclaration> subFolios) {
        this.subManifests = subFolios;
    }

    public OffsetDateTime getLastFileStatusCheckTime() {
        return lastFileStatusCheckTime;
    }

    public void setLastFileStatusCheckTime(final OffsetDateTime lastFileStatusCheckTime) {
        this.lastFileStatusCheckTime = lastFileStatusCheckTime;
    }

    public OffsetDateTime getLastFileModifiedTime() {
        return lastFileModifiedTime;
    }

    public void setLastFileModifiedTime(final OffsetDateTime lastFileModifiedTime) {
        this.lastFileModifiedTime = lastFileModifiedTime;
    }

    public OffsetDateTime getLastChildFileModifiedTime() {
        return lastChildFileModifiedTime;
    }

    public void setLastChildFileModifiedTime(final OffsetDateTime lastChildFileModifiedTime) {
        this.lastChildFileModifiedTime = lastChildFileModifiedTime;
    }

    /**
     * Gets the list of relationships in which the entities in the current folio are involved in.
     * @return
     */
    public List<E2ERelationship> getRelationships() {
        return relationships;
    }

    /**
     * Sets the list of relationships in which the entities in the current folio are involved in.
     * @param relationships
     */
    public void setRelationships(final List<E2ERelationship> relationships) {
        this.relationships = relationships;
    }

    public String getJsonSchemaSemanticVersion() {
        return jsonSchemaSemanticVersion;
    }

    public void setJsonSchemaSemanticVersion(final String jsonSchemaSemanticVersion) {
        this.jsonSchemaSemanticVersion = jsonSchemaSemanticVersion;
    }
}
