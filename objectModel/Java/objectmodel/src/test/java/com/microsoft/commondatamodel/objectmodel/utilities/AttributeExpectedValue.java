// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.utilities;

import java.util.List;

/**
 * Class to contain Attribute's expected value.
 */
public class AttributeExpectedValue {
    private String dataFormat;
    private String dataType;
    private String description;
    private String displayName;
    private String explanation;
    private boolean isNullable;
    private boolean isPrimaryKey;
    private boolean isReadOnly;
    private String maximumLength;
    private String maximumValue;
    private String minimumValue;
    private String name;
    private String purpose;
    private String sourceName;
    private int sourceOrdering;
    private String attributeContext;
    private String attributeGroupName;
    private List<AttributeExpectedValue> members;

    public String getDataFormat() {
        return dataFormat;
    }

    public void setDataFormat(final String dataFormat) {
        this.dataFormat = dataFormat;
    }

    public String getDataType() {
        return dataType;
    }

    public void setDataType(final String dataType) {
        this.dataType = dataType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(final String description) {
        this.description = description;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(final String displayName) {
        this.displayName = displayName;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(final String explanation) {
        this.explanation = explanation;
    }

    public boolean getNullable() {
        return isNullable;
    }

    public void setNullable(final boolean isNullable) {
        this.isNullable = isNullable;
    }

    public boolean getPrimaryKey() {
        return isPrimaryKey;
    }

    public void setPrimaryKey(final boolean isPrimaryKey) {
        this.isPrimaryKey = isPrimaryKey;
    }

    public boolean getReadOnly() {
        return isReadOnly;
    }

    public void setReadOnly(final boolean isReadOnly) {
        this.isReadOnly = isReadOnly;
    }

    public String getMaximumLength() {
        return maximumLength;
    }

    public void setMaximumLength(final String maximumLength) {
        this.maximumLength = maximumLength;
    }

    public String getMaximumValue() {
        return maximumValue;
    }

    public void setMaximumValue(final String maximumValue) {
        this.maximumValue = maximumValue;
    }

    public String getMinimumValue() {
        return minimumValue;
    }

    public void setMinimumValue(final String minimumValue) {
        this.minimumValue = minimumValue;
    }

    public String getName() {
        return name;
    }

    public void setName(final String name) {
        this.name = name;
    }

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(final String purpose) {
        this.purpose = purpose;
    }

    public String getSourceName() {
        return sourceName;
    }

    public void setSourceName(final String sourceName) {
        this.sourceName = sourceName;
    }

    public int getSourceOrdering() {
        return sourceOrdering;
    }

    public void setSourceOrdering(final int sourceOrdering) {
        this.sourceOrdering = sourceOrdering;
    }

    public String getAttributeContext() {
        return attributeContext;
    }

    public void setAttributeContext(final String attributeContext) {
        this.attributeContext = attributeContext;
    }

    public String getAttributeGroupName() {
        return attributeGroupName;
    }

    public void setAttributeGroupName(final String attributeGroupName) {
        this.attributeGroupName = attributeGroupName;
    }

    public List<AttributeExpectedValue> getMembers() {
        return members;
    }

    public void setMembers(final List<AttributeExpectedValue> members) {
        this.members = members;
    }
}
