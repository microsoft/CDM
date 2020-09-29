// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.projection;

import org.testng.annotations.Test;

/**
 * Type Attribute Test Parameters
 */
public class TypeAttributeParam {
    /**
     * Attribute name property
     */
    private String attributeName = "";

    public String getAttributeName() {
        return attributeName;
    }

    public void setAttributeName(String attributeName) {
        this.attributeName = attributeName;
    }

    /**
     * Attribute data type property
     */
    private String attributeDataType = "";

    public String getAttributeDataType() {
        return attributeDataType;
    }

    public void setAttributeDataType(String attributeDataType) {
        this.attributeDataType = attributeDataType;
    }

    /**
     * Attribute purpose property
     */
    private String attributePurpose = "";

    public String getAttributePurpose() {
        return attributePurpose;
    }

    public void setAttributePurpose(String attributePurpose) {
        this.attributePurpose = attributePurpose;
    }

    public TypeAttributeParam() {
        this(null, null, null);
    }

    public TypeAttributeParam(String name, String dataType, String purpose) {
        setAttributeName(name);
        setAttributeDataType(dataType);
        setAttributePurpose(purpose);
    }
}
