// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types;


import com.fasterxml.jackson.databind.node.ArrayNode;

public class AttributeContext {
    private String explanation;
    private String type;
    private String name;
    private String parent;
    private String definition;
    private ArrayNode appliedTraits;
    private ArrayNode contents;
    private ArrayNode lineage;

    public String getExplanation() {
        return this.explanation;
    }

    public void setExplanation(final String explanation) {
        this.explanation = explanation;
    }

    public String getType() {
        return this.type;
    }

    public void setType(final String type) {
        this.type = type;
    }

    public String getName() {
        return this.name;
    }

    public void setName(final String name) {
        this.name = name;
    }

    public String getParent() {
        return this.parent;
    }

    public void setParent(final String parent) {
        this.parent = parent;
    }

    public String getDefinition() {
        return this.definition;
    }

    public void setDefinition(final String definition) {
        this.definition = definition;
    }

    public ArrayNode getAppliedTraits() {
        return this.appliedTraits;
    }

    public void setAppliedTraits(final ArrayNode appliedTraits) {
        this.appliedTraits = appliedTraits;
    }

    public ArrayNode getContents() {
        return this.contents;
    }

    public void setContents(final ArrayNode contents) {
        this.contents = contents;
    }

    public ArrayNode getLineage() {
        return this.lineage;
    }

    public void setLineage(final ArrayNode lineage) {
        this.lineage = lineage;
    }
}
