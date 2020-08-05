// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.projections;

import com.fasterxml.jackson.databind.JsonNode;

import java.util.List;

/**
 * OperationCombineAttributes class
 */
public class OperationCombineAttributes extends OperationBase {
    private List<String> take;
    private JsonNode mergeInto;

    public List<String> getTake() {
        return take;
    }

    public void setTake(final List<String> take) {
        this.take = take;
    }

    public JsonNode getMergeInto() {
        return mergeInto;
    }

    public void setMergeInto(final JsonNode mergeInto) {
        this.mergeInto = mergeInto;
    }
}
