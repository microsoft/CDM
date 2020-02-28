// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;

public class Purpose {
    private String explanation;
    private String purposeName;
    private JsonNode extendsPurpose;
    private ArrayNode exhibitsTraits;

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(final String explanation) {
        this.explanation = explanation;
    }

    public String getPurposeName() {
        return purposeName;
    }

    public void setPurposeName(final String purposeName) {
        this.purposeName = purposeName;
    }

    public JsonNode getExtendsPurpose() {
        return extendsPurpose;
    }

    public void setExtendsPurpose(final JsonNode extendsPurpose) {
        this.extendsPurpose = extendsPurpose;
    }

    public ArrayNode getExhibitsTraits() {
        return exhibitsTraits;
    }

    public void setExhibitsTraits(final ArrayNode exhibitsTraits) {
        this.exhibitsTraits = exhibitsTraits;
    }
}

