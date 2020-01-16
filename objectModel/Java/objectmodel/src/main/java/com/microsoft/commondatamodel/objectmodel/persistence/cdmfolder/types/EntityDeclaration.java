package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types;

import com.fasterxml.jackson.databind.node.ArrayNode;

public class EntityDeclaration {
    private String type;
    private String entityName;
    private String explanation;
    private ArrayNode exhibitsTraits;

    public String getType() {
      return type;
    }

    public void setType(final String type) {
      this.type = type;
    }

  public String getEntityName() {
        return entityName;
    }

    public void setEntityName(final String entityName) {
        this.entityName = entityName;
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

    public static class EntityDeclarationDefinitionType {
        public static final String LocalEntity = "LocalEntity";
        public static final String ReferencedEntity = "ReferencedEntity";
    }
}