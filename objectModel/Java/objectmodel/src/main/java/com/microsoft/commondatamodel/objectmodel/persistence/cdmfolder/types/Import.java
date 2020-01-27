package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Import {
    @JsonProperty("uri")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String uri; // deprecated

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String corpusPath;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String moniker;

    public String getUri() {
        return uri;
    }

    public void setUri(final String uri) {
        this.uri = uri;
    }

    public String getCorpusPath() {
        return corpusPath;
    }

    public void setCorpusPath(final String corpusPath) {
        this.corpusPath = corpusPath;
    }

    public String getMoniker() {
        return moniker;
    }

    public void setMoniker(final String moniker) {
        this.moniker = moniker;
    }
}
