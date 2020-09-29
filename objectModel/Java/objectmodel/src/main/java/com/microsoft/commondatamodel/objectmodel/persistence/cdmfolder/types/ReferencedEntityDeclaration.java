// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types;

/**
 * The referenced entity declaration for CDM folders format.
 */
public class ReferencedEntityDeclaration extends EntityDeclaration {
    private String entityPath;
    private String lastFileStatusCheckTime;
    private String lastFileModifiedTime;

    /**
     * Gets the corpus path pointing to the external document.
     * @return String
     */
    public String getEntityPath() {
        return entityPath;
    }

    /**
     * Sets the corpus path pointing to the external document.
     * @param entityPath String
     */
    public void setEntityPath(final String entityPath) {
        this.entityPath = entityPath;
    }

    /**
     * Sets the corpus path pointing to the external document.
     * @param entityDeclaration String
     */
    public void setEntityDeclaration(final String entityDeclaration) {
        this.entityPath = entityDeclaration;
    }

    public String getLastFileStatusCheckTime() {
        return lastFileStatusCheckTime;
    }

    public void setLastFileStatusCheckTime(final String lastFileStatusCheckTime) {
        this.lastFileStatusCheckTime = lastFileStatusCheckTime;
    }

    public String getLastFileModifiedTime() {
        return lastFileModifiedTime;
    }

    public void setLastFileModifiedTime(final String lastFileModifiedTime) {
        this.lastFileModifiedTime = lastFileModifiedTime;
    }
}
