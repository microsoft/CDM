package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;

public class DataType {
    private String explanation;
    private String dataTypeName;
    private JsonNode extendsDataType;
    private ArrayNode exhibitsTraits;

    public String getExplanation() {
        return this.explanation;
    }

    public void setExplanation(final String explanation) {
        this.explanation = explanation;
    }

    public String getDataTypeName() {
        return this.dataTypeName;
    }

    public void setDataTypeName(final String dataTypeName) {
        this.dataTypeName = dataTypeName;
    }

    public JsonNode getExtendsDataType() {
        return this.extendsDataType;
    }

    public void setExtendsDataType(final JsonNode extendsDataType) {
        this.extendsDataType = extendsDataType;
    }

    public ArrayNode getExhibitsTraits() {
        return this.exhibitsTraits;
    }

    public void setExhibitsTraits(final ArrayNode exhibitsTraits) {
        this.exhibitsTraits = exhibitsTraits;
    }
}

