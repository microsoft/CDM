package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * The entity to entity relationship object that will be populated in a manifest.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class E2ERelationship {
    private String fromEntity;
    private String fromEntityAttribute;
    private String toEntity;
    private String toEntityAttribute;
    
    /**
     * Gets the absolute corpus path of the referencing entity.
     * @return
     */
    public String getFromEntity() {
        return fromEntity;
    }

    /**
     * Sets the absolute corpus path of the referencing entity.
     * @param fromEntity
     */
    public void setFromEntity(final String fromEntity) {
        this.fromEntity = fromEntity;
    }

    /**
     * Gets the name of the attribute that is referencing the other entity.
     * @return
     */
    public String getFromEntityAttribute() {
        return fromEntityAttribute;
    }

    /**
     * Sets the name of the attribute that is referencing the other entity.
     * @param fromEntityAttribute
     */
    public void setFromEntityAttribute(final String fromEntityAttribute) {
        this.fromEntityAttribute = fromEntityAttribute;
    }

    /**
     * Gets the absolute corpus path of the referenced entity.
     * @return
     */
    public String getToEntity() {
        return toEntity;
    }

    /**
     * Sets the absolute corpus path of the referenced entity.
     * @param toEntity
     */
    public void setToEntity(final String toEntity) {
        this.toEntity = toEntity;
    }

    /**
     * Gets the name of the attribute that is being referenced.
     * @return
     */
    public String getToEntityAttribute() {
        return toEntityAttribute;
    }

    /**
     * Sets the name of the attribute that is being referenced.
     * @param toEntityAttribute
     */
    public void setToEntityAttribute(final String toEntityAttribute) {
        this.toEntityAttribute = toEntityAttribute;
    }
}
