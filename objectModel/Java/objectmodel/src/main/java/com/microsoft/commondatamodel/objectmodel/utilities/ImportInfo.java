// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.utilities;

/**
 * @deprecated
 * Contains information about an import in the imports pririty map.
 */
public class ImportInfo {
    /**
     * The priority that the import has with respect to the document where it is imported.
     */
    private int priority;

    /**
     * If the import has a moniker or not.
     */
    private boolean isMoniker;

    /**
     * Constructor of the ImportInfo class.
     */
    public ImportInfo(int priority, boolean isMoniker)
    {
        this.priority = priority;
        this.isMoniker = isMoniker;
    }

    public int getPriority() {
        return this.priority;
    }

    public void setPriority(final int maxDepth) {
        this.priority = priority;
    }

    public boolean getIsMoniker() {
        return this.isMoniker;
    }

    public void setIsMoniker(final boolean isMoniker) {
        this.isMoniker = isMoniker;
    }
}
