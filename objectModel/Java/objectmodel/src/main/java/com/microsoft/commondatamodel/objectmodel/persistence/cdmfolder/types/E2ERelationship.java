// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * The entity to entity relationship object that will be populated in a manifest.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class E2ERelationship {
    private String name;
    private String fromEntity;
    private String fromEntityAttribute;
    private String toEntity;
    private String toEntityAttribute;

    /**
     * Gets the name of the relationship
     * @return String
     */
    public String getName() {
        return name;
    }

    /**
     * Sets the name of the relationship
     * @param name String
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Gets the absolute corpus path of the referencing entity.
     * @return String
     */
    public String getFromEntity() {
        return fromEntity;
    }

    /**
     * Sets the absolute corpus path of the referencing entity.
     * @param fromEntity String
     */
    public void setFromEntity(final String fromEntity) {
        this.fromEntity = fromEntity;
    }

    /**
     * Gets the name of the attribute that is referencing the other entity.
     * @return String
     */
    public String getFromEntityAttribute() {
        return fromEntityAttribute;
    }

    /**
     * Sets the name of the attribute that is referencing the other entity.
     * @param fromEntityAttribute String
     */
    public void setFromEntityAttribute(final String fromEntityAttribute) {
        this.fromEntityAttribute = fromEntityAttribute;
    }

    /**
     * Gets the absolute corpus path of the referenced entity.
     * @return String
     */
    public String getToEntity() {
        return toEntity;
    }

    /**
     * Sets the absolute corpus path of the referenced entity.
     * @param toEntity String
     */
    public void setToEntity(final String toEntity) {
        this.toEntity = toEntity;
    }

    /**
     * Gets the name of the attribute that is being referenced.
     * @return String
     */
    public String getToEntityAttribute() {
        return toEntityAttribute;
    }

    /**
     * Sets the name of the attribute that is being referenced.
     * @param toEntityAttribute String
     */
    public void setToEntityAttribute(final String toEntityAttribute) {
        this.toEntityAttribute = toEntityAttribute;
    }
}
