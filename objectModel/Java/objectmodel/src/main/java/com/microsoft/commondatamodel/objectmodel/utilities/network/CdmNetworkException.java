// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.utilities.network;

public abstract class CdmNetworkException extends RuntimeException {
    public CdmNetworkException() {
        super();
    }

    public CdmNetworkException(final String message) {
        super(message);
    }
}
