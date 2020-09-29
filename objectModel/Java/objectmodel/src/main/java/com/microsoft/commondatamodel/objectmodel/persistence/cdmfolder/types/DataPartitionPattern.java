// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types;

import com.fasterxml.jackson.databind.node.ArrayNode;
import java.util.List;

/**
 * The representation of data partition pattern in the CDM Folders format.
 */
public class DataPartitionPattern extends FileStatus {
    private String name;
    private String explanation;
    private String rootLocation;
    private String globPattern;
    private String regularExpression;
    private List<String> parameters;
    private String specializedSchema;
    private ArrayNode exhibitsTraits;

    /**
     * Gets the name for the pattern.
     * @return String
     */
    public String getName() {
        return this.name;
    }

    /**
     * Sets the name for the pattern.
     * @param name String
     */
    public void setName(final String name) {
        this.name = name;
    }

    /**
     * Gets the explanation for the pattern.
     * @return String
     */
    public String getExplanation() {
        return this.explanation;
    }

    /**
     * Sets the explanation for the pattern.
     * @param explanation String
     */
    public void setExplanation(final String explanation) {
        this.explanation = explanation;
    }

    /**
     * Gets the starting location corpus path for searching for inferred data partitions.
     * @return String
     */
    public String getRootLocation() {
        return this.rootLocation;
    }

    /**
     * Sets the starting location corpus path for searching for inferred data partitions.
     * @param rootLocation String
     */
    public void setRootLocation(final String rootLocation) {
        this.rootLocation = rootLocation;
    }

    /**
     * Gets the glob pattern used for searching partitions.
     * @return String
     */
    public String getGlobPattern() {
        return this.globPattern;
    }

    /**
     * Sets the glob pattern used for searching partitions.
     * @param globPattern String
     */
    public void setGlobPattern(final String globPattern) {
        this.globPattern = globPattern;
    }

    /**
     * Gets the regular expression string to use for searching partitions.
     * @return String
     */
    public String getRegularExpression() {
        return this.regularExpression;
    }

    /**
     * Sets the regular expression string to use for searching partitions.
     * @param regularExpression String
     */
    public void setRegularExpression(final String regularExpression) {
        this.regularExpression = regularExpression;
    }

    /**
     * Gets the names for replacement values from regular expression.
     * @return List of String
     */
    public List<String> getParameters() {
        return this.parameters;
    }

    /**
     * Sets the names for replacement values from regular expression.
     * @param parameters List of string
     */
    public void setParameters(final List<String> parameters) {
        this.parameters = parameters;
    }

    /**
     * Gets the corpus path for specialized schema to use for matched pattern partitions.
     * @return String
     */
    public String getSpecializedSchema() {
        return this.specializedSchema;
    }

    /**
     * Sets the corpus path for specialized schema to use for matched pattern partitions.
     * @param specializedSchema String
     */
    public void setSpecializedSchema(final String specializedSchema) {
        this.specializedSchema = specializedSchema;
    }

    /**
     * Gets the exhibited traits.
     * @return ArrayNode
     */
    public ArrayNode getExhibitsTraits() {
        return this.exhibitsTraits;
    }

    /**
     * Sets the exhibited traits.
     * @param exhibitsTraits ArrayNode
     */
    public void setExhibitsTraits(final ArrayNode exhibitsTraits) {
        this.exhibitsTraits = exhibitsTraits;
    }
}
