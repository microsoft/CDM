package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types;

import com.fasterxml.jackson.databind.JsonNode;

public class Argument {

    private String explanation;
    private String name;
    private JsonNode value;

    public String getExplanation() {
        return this.explanation;
    }

    public void setExplanation(final String explanation) {
        this.explanation = explanation;
    }

    public String getName() {
        return this.name;
    }

    public void setName(final String name) {
        this.name = name;
    }

    public JsonNode getValue() {
        return this.value;
    }

    public void setValue(final JsonNode value) {
        this.value = value;
    }
}
