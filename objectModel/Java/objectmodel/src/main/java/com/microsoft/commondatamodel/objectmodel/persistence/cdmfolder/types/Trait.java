package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types;

import com.fasterxml.jackson.databind.node.ArrayNode;
import java.util.List;

public class Trait {
    private String explanation;
    private String traitName;
    private Object extendsTrait;
    private ArrayNode hasParameters;
    private Boolean elevated;
    private Boolean modifiesAttributes;
    private Boolean ugly;
    private List<String> associatedProperties;

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(final String explanation) {
        this.explanation = explanation;
    }

    public String getTraitName() {
        return traitName;
    }

    public void setTraitName(final String traitName) {
        this.traitName = traitName;
    }

    public Object getExtendsTrait() {
        return extendsTrait;
    }

    public void setExtendsTrait(final Object extendsTrait) {
        this.extendsTrait = extendsTrait;
    }

    public ArrayNode getHasParameters() {
        return hasParameters;
    }

    public void setParameters(final ArrayNode hasParameters) {
        this.hasParameters = hasParameters;
    }

    public Boolean getElevated() {
        return elevated;
    }

    public void setElevated(final Boolean elevated) {
        this.elevated = elevated;
    }

    public Boolean getModifiesAttributes() {
        return modifiesAttributes;
    }

    public void setModifiesAttributes(final Boolean modifiesAttributes) {
        this.modifiesAttributes = modifiesAttributes;
    }

    public Boolean getUgly() {
        return ugly;
    }

    public void setUgly(final Boolean ugly) {
        this.ugly = ugly;
    }

    public List<String> getAssociatedProperties() {
        return associatedProperties;
    }

    public void setAssociatedProperties(final List<String> associatedProperties) {
        this.associatedProperties = associatedProperties;
    }
}
