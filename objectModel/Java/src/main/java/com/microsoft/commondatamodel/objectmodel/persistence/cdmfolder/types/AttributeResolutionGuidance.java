package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types;

import com.fasterxml.jackson.databind.JsonNode;
import java.util.List;

public class AttributeResolutionGuidance {
    private Boolean removeAttribute;
    private List<String> imposedDirectives;
    private List<String> removedDirectives;
    private JsonNode addSupportingAttribute;
    private String cardinality;
    private String renameFormat;
    private Expansion expansion;
    private EntityByReference entityByReference;
    private SelectsSubAttribute selectsSubAttribute;

    public Boolean isRemoveAttribute() {
        return this.removeAttribute;
    }

    public Boolean getRemoveAttribute() {
        return this.removeAttribute;
    }

    public void setRemoveAttribute(final Boolean removeAttribute) {
        this.removeAttribute = removeAttribute;
    }

    public List<String> getImposedDirectives() {
        return this.imposedDirectives;
    }

    public void setImposedDirectives(final List<String> imposedDirectives) {
        this.imposedDirectives = imposedDirectives;
    }

    public List<String> getRemovedDirectives() {
        return this.removedDirectives;
    }

    public void setRemovedDirectives(final List<String> removedDirectives) {
        this.removedDirectives = removedDirectives;
    }

    public JsonNode getAddSupportingAttribute() {
        return this.addSupportingAttribute;
    }

    public void setAddSupportingAttribute(final JsonNode addSupportingAttribute) {
        this.addSupportingAttribute = addSupportingAttribute;
    }

    public String getCardinality() {
        return this.cardinality;
    }

    public void setCardinality(final String cardinality) {
        this.cardinality = cardinality;
    }

    public String getRenameFormat() {
        return this.renameFormat;
    }

    public void setRenameFormat(final String renameFormat) {
        this.renameFormat = renameFormat;
    }

    public Expansion getExpansion() {
        return this.expansion;
    }

    public void setExpansion(final Expansion expansion) {
        this.expansion = expansion;
    }

    public EntityByReference getEntityByReference() {
        return this.entityByReference;
    }

    public void setEntityByReference(final EntityByReference entityByReference) {
        this.entityByReference = entityByReference;
    }

    public SelectsSubAttribute getSelectsSubAttribute() {
        return this.selectsSubAttribute;
    }

    public void setSelectsSubAttribute(final SelectsSubAttribute selectsSubAttribute) {
        this.selectsSubAttribute = selectsSubAttribute;
    }
}
