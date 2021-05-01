// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types;

import com.fasterxml.jackson.databind.node.ArrayNode;

import java.util.List;

public class TraitGroup {
    private String explanation;
    private String traitGroupName;
    private ArrayNode exhibitsTraits;

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(final String explanation) {
        this.explanation = explanation;
    }

    public String getTraitGroupName() {
        return traitGroupName;
    }

    public void setTraitGroupName(final String traitGroupName) {
        this.traitGroupName = traitGroupName;
    }

    public ArrayNode getExhibitsTraits() {
        return this.exhibitsTraits;
    }

    public void setExhibitsTraits(final ArrayNode exhibitsTraits) {
        this.exhibitsTraits = exhibitsTraits;
    }
}
