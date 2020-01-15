package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types;

import com.fasterxml.jackson.databind.JsonNode;

public class EntityByReference {
    private Boolean allowReference;
    private Boolean alwaysIncludeForeignKey;
    private Integer referenceOnlyAfterDepth;
    private JsonNode foreignKeyAttribute;

    public Boolean isAllowReference() {
        return this.allowReference;
    }

    public Boolean getAllowReference() {
        return this.allowReference;
    }

    public void setAllowReference(final Boolean allowReference) {
        this.allowReference = allowReference;
    }

    public Boolean isAlwaysIncludeForeignKey() {
        return this.alwaysIncludeForeignKey;
    }

    public Boolean getAlwaysIncludeForeignKey() {
        return this.alwaysIncludeForeignKey;
    }

    public void setAlwaysIncludeForeignKey(final Boolean alwaysIncludeForeignKey) {
        this.alwaysIncludeForeignKey = alwaysIncludeForeignKey;
    }

    public Integer getReferenceOnlyAfterDepth() {
        return this.referenceOnlyAfterDepth;
    }

    public void setReferenceOnlyAfterDepth(final Integer referenceOnlyAfterDepth) {
        this.referenceOnlyAfterDepth = referenceOnlyAfterDepth;
    }

    public JsonNode getForeignKeyAttribute() {
        return this.foreignKeyAttribute;
    }

    public void setForeignKeyAttribute(final JsonNode foreignKeyAttribute) {
        this.foreignKeyAttribute = foreignKeyAttribute;
    }
}
