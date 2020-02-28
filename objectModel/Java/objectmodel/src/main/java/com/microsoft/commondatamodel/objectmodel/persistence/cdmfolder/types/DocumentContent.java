// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import java.util.List;

public class DocumentContent {
    private String jsonSchemaSemanticVersion;

    @JsonProperty("$schema")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String schema;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private List<Import> imports;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private List<JsonNode> definitions;

    public String getJsonSchemaSemanticVersion() {
        return jsonSchemaSemanticVersion;
    }

    public void setJsonSchemaSemanticVersion(final String jsonSchemaSemanticVersion) {
        this.jsonSchemaSemanticVersion = jsonSchemaSemanticVersion;
    }

    public String getSchema() {
        return schema;
    }

    public void setSchema(final String schema) {
        this.schema = schema;
    }

    public List<Import> getImports() {
        return imports;
    }

    public void setImports(final List<Import> imports) {
        this.imports = imports;
    }

    public List<JsonNode> getDefinitions() {
        return definitions;
    }

    public void setDefinitions(List<JsonNode> definitions) {
        this.definitions = definitions;
    }
}
