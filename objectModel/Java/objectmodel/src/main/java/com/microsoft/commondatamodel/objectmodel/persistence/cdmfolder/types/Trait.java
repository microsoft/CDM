// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

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
    private Object defaultVerb;
    private ArrayNode exhibitsTraits;

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

    public Object getDefaultVerb() {
        return this.defaultVerb;
    }

    public void setDefaultVerb(final Object defaultVerb) {
        this.defaultVerb = defaultVerb;
    }

    public ArrayNode getExhibitsTraits() {
        return exhibitsTraits;
    }

    public void setExhibitsTraits(final ArrayNode exhibitsTraits) {
        this.exhibitsTraits = exhibitsTraits;
    }


}
