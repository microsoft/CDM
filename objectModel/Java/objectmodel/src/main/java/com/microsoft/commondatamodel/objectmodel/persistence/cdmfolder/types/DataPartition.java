// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types;

import com.fasterxml.jackson.databind.node.ArrayNode;
import java.util.List;

/**
 * The representation of data partition in CDM Folders format.
 */
public class DataPartition extends FileStatus {
    private String name;
    private String location;
    private ArrayNode exhibitsTraits;
    private List<KeyValuePair<String, String>> arguments;
    private String specializedSchema;

    /**
     * Sets new name.
     *
     * @param name New value of name.
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Gets name.
     *
     * @return Value of name.
     */
    public String getName() {
        return name;
    }

    /**
     * Gets the corpus path for the data file location.
     * @return String
     */
    public String getLocation() {
        return this.location;
    }

    /**
     * Sets the corpus path for the data file location.
     * @param location String
     */
    public void setLocation(final String location) {
        this.location = location;
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
     * @param exhibitsTraits Arraynode
     */
    public void setExhibitsTraits(final ArrayNode exhibitsTraits) {
        this.exhibitsTraits = exhibitsTraits;
    }

    /**
     * Gets the list of key value pairs to give names for the replacement values from the RegEx.
     * @return List of KVP
     */
    public List<KeyValuePair<String,String>> getArguments() {
        return this.arguments;
    }

    /**
     * Sets the list of key value pairs to give names for the replacement values from the RegEx.
     * @param arguments List of KVP
     */
    public void setArguments(final List<KeyValuePair<String,String>> arguments) {
        this.arguments = arguments;
    }

    /**
     * Gets the path of a specialized schema to use specifically for the partitions generated.
     * @return String
     */
    public String getSpecializedSchema() {
        return this.specializedSchema;
    }

    /**
     * Sets the path of a specialized schema to use specifically for the partitions generated.
     * @param specializedSchema String
     */
    public void setSpecializedSchema(final String specializedSchema) {
        this.specializedSchema = specializedSchema;
    }
}
