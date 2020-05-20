// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.utilities;

import java.util.List;

/**
 * Class to contain AttributeContext's expected values.
 */
public class AttributeContextExpectedValue {
    private String type;
    private String name;
    private String parent;
    private String definition;
    private List<AttributeContextExpectedValue> contexts;
    private List<String> contextStrings;

    public String getType() {
        return type;
    }

    public void setType(final String type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(final String name) {
        this.name = name;
    }

    public String getParent() {
        return parent;
    }

    public void setParent(final String parent) {
        this.parent = parent;
    }

    public String getDefinition() {
        return definition;
    }

    public void setDefinition(final String definition) {
        this.definition = definition;
    }

    public List<AttributeContextExpectedValue> getContexts() {
        return contexts;
    }

    public void setContexts(final List<AttributeContextExpectedValue> contexts) {
        this.contexts = contexts;
    }

    public List<String> getContextStrings() {
        return contextStrings;
    }

    public void setContextStrings(final List<String> contextStrings) {
        this.contextStrings = contextStrings;
    }
}
