// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types;

import com.fasterxml.jackson.databind.node.ArrayNode;

public class AttributeGroup {
    private String explanation;
    private String attributeGroupName;
    private String attributeContext;
    private ArrayNode members;
    private ArrayNode exhibitsTraits;

    public String getExplanation() {
        return this.explanation;
    }

    public void setExplanation(final String explanation) {
        this.explanation = explanation;
    }

    public String getAttributeGroupName() {
        return this.attributeGroupName;
    }

    public void setAttributeGroupName(final String attributeGroupName) {
        this.attributeGroupName = attributeGroupName;
    }

    public String getAttributeContext() {
        return this.attributeContext;
    }

    public void setAttributeContext(final String attributeContext) {
        this.attributeContext = attributeContext;
    }

    public ArrayNode getMembers() {
        return this.members;
    }

    public void setMembers(final ArrayNode members) {
        this.members = members;
    }

    public ArrayNode getExhibitsTraits() {
        return this.exhibitsTraits;
    }

    public void setExhibitsTraits(final ArrayNode exhibitsTraits) {
        this.exhibitsTraits = exhibitsTraits;
    }
}
