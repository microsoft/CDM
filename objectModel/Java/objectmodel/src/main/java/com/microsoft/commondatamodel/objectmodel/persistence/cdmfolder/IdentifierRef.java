// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

public class IdentifierRef {
    public String atCorpusPath;
    public String identifier;

    public IdentifierRef(final String atCorpusPath, final String identifier) {
        this.atCorpusPath = atCorpusPath;
        this.identifier = identifier;
    }
}
