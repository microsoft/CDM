// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.projections;

public class CardinalitySettingsData {
    private String minimum;
    private String maximum;

    public String getMinimum() {
        return minimum;
    }

    public void setMinimum(final String min) {
        this.minimum = min;
    }

    public String getMaximum() {
        return maximum;
    }

    public void setMaximum(final String max) {
        this.maximum = max;
    }
}
